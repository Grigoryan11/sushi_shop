import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { userEntity } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactDto } from './dto/contact.dto';
import { MailerService } from '@nestjs-modules/mailer';
import file from '../auth/admin_auth/admin.json';
import { Order } from '../db/entities/order.entity';
import { Product } from '../db/entities/product.entity';
import { CartDto } from './dto/cart.dto';
import { CartEntity } from '../db/entities/cart.entity';
import { BonusEntity } from '../db/entities/bonus.entity';

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
    const order = await this.userRepo.findOne({
      where: { email: currentUser.email },
    });
    const orderId = await this.orderRepo.find({
      where: { user: order.id },
      relations: ['user', 'product'],
    });
    if (!order) {
      throw new HttpException('This order cant found', 404);
    }
    return {
      message: 'success',
      data: orderId,
    };
  }

  async getCart() {
    const cart = await this.cartRepo.find({
      relations: ['product'],
    });
    if (!cart) {
      throw new HttpException('This order cant found!!!', 404);
    }
    return {
      message: 'success',
      data: cart,
    };
  }

  // async createCart(payload: CartDto) {
  //   const product = await this.productRepo.findOne({
  //     where: { id: payload.product },
  //   });
  //   if (product) {
  //     const cart = await this.cartRepo.save({
  //       count: payload.count,
  //       product: product,
  //     });
  //     return {
  //       message: 'success',
  //       data: cart,
  //     };
  //   } else {
  //     throw new HttpException('Product not found!!!', 404);
  //   }
  // }

  // async createOrderForUser(payload: orderDto, currentUser) {
  //   const user = await this.userRepo.findOne({
  //     where: {
  //       email: currentUser.email,
  //     },
  //   });
  //   const product = await this.productRepo.findOne({
  //     where: { id: payload.product },
  //   });
  //   if (product) {
  //     const order = await this.orderRepo.save({
  //       fullName: payload.fullName,
  //       address: payload.address,
  //       phone: payload.phone,
  //       user: user,
  //       product: [product],
  //     });
  //
  //     console.log(order);
  //
  //     return {
  //       data: order,
  //     };
  //   } else {
  //     throw new HttpException('Product not found!!!', 404);
  //   }
  // }
  // async bonus(currentUser) {
  //   const user = await this.userRepo.findOne({
  //     where: {
  //       email: currentUser.email,
  //     },
  //   });
  //   const bonus = await this.bonusRepo.find();
  //   const num = bonus[0];
  //   if (user.counter >= num.limit) {
  //     user.bonus += num.bonus;
  //     user.counter -= num.limit;
  //     await this.userRepo.save(user);
  //   }
  // }
}
