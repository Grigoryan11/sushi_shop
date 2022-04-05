import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ContactDto } from './dto/contact.dto';
import { orderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt.authGurad';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('contact')
  async contactUs(@Body() payload: ContactDto) {
    return this.userService.contactUs(payload);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getOrders() {
    return this.userService.getOrders();
  }

  @Post('order')
  async createOrder(@Body() payload: orderDto) {
    return this.userService.createOrder(payload);
  }
}
