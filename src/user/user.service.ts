import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { userEntity } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactDto } from './dto/contact.dto';
import { MailerService } from '@nestjs-modules/mailer';
import file from '../auth/admin_auth/admin.json';
import { Order } from '../db/entities/order.entity';
import { Product } from '../db/entities/product.entity';
import { CartEntity } from '../db/entities/cart.entity';
import { BonusEntity } from '../db/entities/bonus.entity';
import { Cart_itemDto } from './dto/cart_item.dto';
import { CartItemEntity } from '../db/entities/cart-Item.entity';
import { orderDto } from './dto/order.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepo: Repository<userEntity>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepo: Repository<CartItemEntity>,
    @InjectRepository(BonusEntity)
    private readonly bonusRepo: Repository<BonusEntity>,
    private readonly mailerService: MailerService,
  ) {}

  async contactUs(payload: ContactDto) {
    const email = file.email;
    if (payload) {
      await this.mailerService.sendMail({
        to: email,
        from: payload.email,
        subject: `Message from WebSite ✔`,
        html: `<h2>Contact email: ${payload.email}</h2></br><h3>Contact Name: ${payload.firstName}</h3></br><h3>Contact Surename: ${payload.lastName}</h3></br><h3>Contact phone: ${payload.phone}</h3></br><h3>Text: ${payload.text}</h3>`,
      });
      return {
        message: 'Success!!',
      };
    }
  }

  async getProducts() {
    const product = await this.productRepo.find();
    if (!product) {
      throw new HttpException('This product cant found!', 404);
    }
    return {
      data: product,
    };
  }

  async getProduct(type: string, language: string) {
    const data = await this.productRepo.find({
      where: {
        type: type,
        language: language,
      },
    });
    if (!data) {
      throw new HttpException('This product cant found', 404);
    }
    return {
      message: 'success',
      data: data,
    };
  }

  async getOrders(currentUser) {
    const user = await this.userRepo.findOne({
      where: { email: currentUser.email },
    });
    const order = await this.cartItemRepo.find({
      where: { cart: user.id },
      relations: ['product', 'cart', 'cart.user'],
    });
    if (!order) {
      throw new HttpException('This order cant found', 404);
    }
    return {
      message: 'success',
      data: order,
    };
  }

  async createCartAuthUser(payload: Cart_itemDto, currentUser) {
    const product = await this.productRepo.findOne({
      where: {
        id: payload.product,
      },
    });
    const user = await this.userRepo.findOne({
      where: {
        email: currentUser.email,
      },
    });
    if (product) {
      const total = payload.quantity * product.price;
      let activeCart = await this.cartRepo.findOne({
        where: { user: user, active: true },
      });
      if (!activeCart) {
        activeCart = await this.cartRepo.save({
          user: user,
          amount: total,
        });
      } else {
        await this.cartRepo.update(
          { id: activeCart.id },
          {
            amount: activeCart.amount + total,
          },
        );
      }
      const cartItem = await this.cartItemRepo.save({
        product: product,
        quantity: payload.quantity,
        cart: activeCart,
      });
      return {
        message: 'Success',
      };
    } else {
      throw new HttpException('Product not found!!!', 404);
    }
  }

  async deleteCartItem(id: number, currentUser) {
    const user = await this.userRepo.findOne({
      where: { email: currentUser.email },
    });
    const cartItem = await this.cartItemRepo.findOne(
      { id },
      { relations: ['product'] },
    );
    const cart = await this.cartRepo.findOne({
      where: { user: user, active: true },
    });
    if (user && cartItem) {
      await this.cartItemRepo.delete({ id });
      cart.amount -= cartItem.product.price;
      await this.cartRepo.save(cart);
      return {
        message: 'Success',
      };
    } else {
      throw new HttpException('CartItem not found!!!', 404);
    }
  }

  async createOrderForUser(payload: orderDto, currentUser) {
    const user = await this.userRepo.findOne({
      where: { email: currentUser.email },
    });
    const cart = await this.cartRepo.findOne({
      where: { user: user, active: true },
    });
    if (cart) {
      if (payload.bonus <= user.bonus || payload.bonus == null) {
        const order = await this.orderRepo.save({
          fullName: payload.fullName,
          address: payload.address,
          phone: payload.phone,
          totalPrice: cart.amount,
          bonus: payload.bonus,
          cart: cart,
        });
        if (order) {
          cart.active = false;
          await this.cartRepo.save(cart);
          user.counter += cart.amount;
          await this.userRepo.save(user);
        }
        const bonus = await this.bonusRepo.find();
        const num = bonus[0];
        if (user.counter >= num.limit) {
          user.bonus += num.bonus;
          user.counter -= num.limit;
          await this.userRepo.save(user);
        }
        user.bonus -= payload.bonus;
        await this.userRepo.save(user);
        return order;
      }
    } else {
      throw new HttpException('Cart not found!!!', 404);
    }
  }
}
