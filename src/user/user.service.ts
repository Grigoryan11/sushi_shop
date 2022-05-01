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
import { Cart_item_updateDto } from './dto/cart_item_update.dto';
import { CartItem_notUserDto } from './dto/cartItem_notUser.dto';
import { OrderNotUserDto } from './dto/orderNotUser.dto';
import { HashForDeleteDto } from './dto/hashForDelete.dto';

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

  async getUserData(currentUser) {
    const user = await this.userRepo.findOne({
      where: { email: currentUser.email },
    });
    if (!user) {
      throw new HttpException('This user cant found!', 404);
    }
    return {
      data: user,
    };
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
    const cart = await this.cartRepo.find({
      where: {
        user: user,
        active: false,
      },
      relations: ['user', 'cartItem', 'cartItem.product'],
    });
    if (!cart) {
      throw new HttpException('Cart product cant found', 404);
    }
    return cart;
  }

  async getCart(currentUser) {
    const user = await this.userRepo.findOne({
      where: { email: currentUser.email },
    });
    const cart = await this.cartRepo.findOne({
      where: {
        user,
        active: true,
      },
    });
    const cart_items = await this.cartItemRepo.find({
      where: {
        cart,
      },
      relations: ['product'],
    });
    if (!cart_items) {
      throw new HttpException('CartItem not found!!!', 404);
    }
    return cart_items;
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
      const existCartItem = await this.cartItemRepo.findOne({
        where: {
          product,
          cart: activeCart,
        },
      });
      if (existCartItem) {
        existCartItem.quantity += +payload.quantity;
        await this.cartItemRepo.update({ id: existCartItem.id }, existCartItem);
      } else {
        await this.cartItemRepo.save({
          product: product,
          quantity: payload.quantity,
          cart: activeCart,
        });
      }
      return {
        message: 'Success',
      };
    } else {
      throw new HttpException('Product not found!!!', 404);
    }
  }

  async updateCartItemUser(
    id: number,
    currentUser,
    payload: Cart_item_updateDto,
  ) {
    const user = await this.userRepo.findOne({
      where: { email: currentUser.email },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (payload.quantity < 1) {
      throw new HttpException(
        'Product quantity can not be less than one!',
        403,
      );
    }
    const cartItem = await this.cartItemRepo.findOne(
      { id },
      { relations: ['product', 'cart'] },
    );
    if (!cartItem.cart.active) {
      throw new HttpException('Something went wrong!!!', 404);
    }
    if (cartItem) {
      await this.cartItemRepo.update({ id }, { quantity: payload.quantity });
      const diff = payload.quantity - cartItem.quantity;
      cartItem.cart.amount += diff * cartItem.product.price;
      await this.cartRepo.update({ id: cartItem.cart.id }, cartItem.cart);
      return {
        message: 'Success',
      };
    } else {
      throw new HttpException('Cart item not found!!!', 404);
    }
  }

  async deleteCartItemUser(id: number, currentUser) {
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
    if (user) {
      if (cart && cartItem) {
        await this.cartItemRepo.delete({ id });
        cart.amount -= cartItem.product.price * cartItem.quantity;
        await this.cartRepo.save(cart);
        return {
          message: 'Success',
        };
      } else {
        throw new HttpException('CartItem not found!!!', 404);
      }
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
        order.totalPrice -= order.bonus;
        await this.orderRepo.save(order);
        user.bonus -= payload.bonus;
        user.counter -= order.bonus;
        await this.userRepo.save(user);
        return order;
      } else {
        throw new HttpException('Bonus exceeds the maximum allowed limit', 403);
      }
    } else {
      throw new HttpException('Cart not found!!!', 404);
    }
  }

  async createCartUser(payload: CartItem_notUserDto) {
    const product = await this.productRepo.findOne({
      where: {
        id: payload.product,
      },
    });
    if (product) {
      const total = payload.quantity * product.price;
      let activeCart = await this.cartRepo.findOne({
        where: { active: true, hash: payload.hash },
      });
      if (!activeCart) {
        activeCart = await this.cartRepo.save({
          amount: total,
          hash: payload.hash,
        });
      } else {
        await this.cartRepo.update(
          { id: activeCart.id },
          {
            amount: activeCart.amount + total,
          },
        );
      }
      const existCartItem = await this.cartItemRepo.findOne({
        where: {
          product,
          cart: activeCart,
        },
      });
      if (existCartItem) {
        existCartItem.quantity += +payload.quantity;
        await this.cartItemRepo.update({ id: existCartItem.id }, existCartItem);
      } else {
        await this.cartItemRepo.save({
          product: product,
          quantity: payload.quantity,
          cart: activeCart,
        });
      }
      return {
        message: 'Success',
      };
    }
  }

  async createOrder(payload: OrderNotUserDto) {
    const cart = await this.cartRepo.findOne({
      where: { active: true, hash: payload.hash },
    });
    if (cart) {
      const order = await this.orderRepo.save({
        fullName: payload.fullName,
        address: payload.address,
        phone: payload.phone,
        totalPrice: cart.amount,
        cart: cart,
      });
      if (order) {
        cart.active = false;
        await this.cartRepo.save(cart);
      }
      return order;
    } else {
      throw new HttpException('Cart not found!!!', 404);
    }
  }

  async deleteCartItem(id: number, payload: HashForDeleteDto) {
    const cartItem = await this.cartItemRepo.findOne(
      { id },
      { relations: ['product'] },
    );
    const cart = await this.cartRepo.findOne({
      where: { hash: payload.hash, active: true },
    });
    if (cart && cartItem) {
      await this.cartItemRepo.delete({ id });
      cart.amount -= cartItem.product.price * cartItem.quantity;
      await this.cartRepo.save(cart);
      return {
        message: 'Success',
      };
    } else {
      throw new HttpException('CartItem not found!!!', 404);
    }
  }

  async updateCartItem(id: number, payload: Cart_item_updateDto) {
    const cartItem = await this.cartItemRepo.findOne(
      { id },
      { relations: ['product', 'cart'] },
    );
    if (payload.quantity < 1) {
      throw new HttpException(
        'Product quantity can not be less than one!',
        403,
      );
    }
    if (!cartItem.cart.active) {
      throw new HttpException('Something went wrong!!!', 404);
    }
    const cart = await this.cartRepo.findOne({
      where: { hash: payload.hash, active: true },
    });
    if (!cart) {
      throw new HttpException('Cart not found!!!', 404);
    }
    if (cartItem) {
      await this.cartItemRepo.update({ id }, { quantity: payload.quantity });
      const diff = payload.quantity - cartItem.quantity;
      cartItem.cart.amount += diff * cartItem.product.price;
      await this.cartRepo.update({ id: cartItem.cart.id }, cartItem.cart);
      return {
        message: 'Success',
      };
    } else {
      throw new HttpException('CartItem not found!!!', 404);
    }
  }
}
