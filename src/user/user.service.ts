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
        subject: `Message from WebSite( Activation Account ) ✔`,
        html: `<h2>Contact email: ${payload.email}</h2></br><h3>Contact Name: ${payload.firstName}</h3></br><h3>Contact Surename: ${payload.lastName}</h3></br><h3>Contact phone: ${payload.phone}</h3></br><h3>Text: ${payload.text}</h3>`,
      });
      return {
        message: 'Success!!',
      };
    }
  }

  async getOrders() {
    const order = await this.orderRepo.findOne({
      where: { email: 'sam.grigoryan.17@gmail.com' },
    });
    const orderId = await this.userRepo.findOne({
      where: { order: order.id },
      relations: ['order', 'order.product'],
    });
    if (!order) {
      throw new HttpException('This order cant found', 404);
    }
    return {
      message: 'success',
      data: orderId,
    };
  }

  async createOrder(payload: orderDto) {
    const product = await this.productRepo.findOne({
      where: { id: payload.product },
    });
    if (product) {
      const order = await this.orderRepo.save({
        email: payload.email,
        fullName: payload.fullName,
        address: payload.address,
        quantity: payload.quantity,
        phone: payload.phone,
        product: payload.product,
      });
      return {
        data: order,
      };
    } else {
      throw new HttpException('Product not found!!!', 404);
    }
  }
}
