import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { userEntity } from '../db/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactDto } from './dto/contact.dto';
import { MailerService } from '@nestjs-modules/mailer';
import file from '../auth/admin_auth/admin.json';
import { orderDto } from './dto/order.dto';
import { Order } from '../db/entities/order.entity';
import { Product } from '../db/entities/product.entity';
import { FilterDto } from '../admin/dto/filter.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(userEntity)
    private readonly userRepo: Repository<userEntity>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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

  async createOrderForUser(payload: orderDto, currentUser) {
    const user = await this.userRepo.findOne({
      where: {
        email: currentUser.email,
      },
    });
    const product = await this.productRepo.findOne({
      where: { id: payload.product },
      relations: ['order'],
    });
    if (product) {
      const order1 = await this.orderRepo.save({
        fullName: payload.fullName,
        address: payload.address,
        phone: payload.phone,
        user: user,
        product: product,
      });

      console.log(order1.product);

      // const order = await this.orderRepo.findOne({
      //   where: { user: currentUser },
      //   relations: ['product'],
      // });
      // console.log(order1);
      // console.log(order);
      // order.product.push(product);
      // await this.orderRepo.save(order);
      return {
        data: order1,
      };
    } else {
      throw new HttpException('Product not found!!!', 404);
    }
  }
}
