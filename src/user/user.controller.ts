import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/jwt.authGurad';
import { CurrentUser } from '../auth/currentUser.decorator';
import { userEntity } from '../db/entities/user.entity';
import { CartDto } from './dto/cart.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('contact')
  async contactUs(@Body() payload: ContactDto) {
    return this.userService.contactUs(payload);
  }

  @Get('products')
  async getProducts() {
    return this.userService.getProducts();
  }

  @Get('product')
  async getProduct(
    @Query('type') type: string,
    @Query('language') language: string,
  ) {
    return this.userService.getProduct(type, language);
  }

  // @Post('bonus')
  // @UseGuards(JwtAuthGuard)
  // async bonus(@CurrentUser() currentUser) {
  //   return this.userService.bonus(currentUser);
  // }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getOrders(@CurrentUser() currentUser) {
    return this.userService.getOrders(currentUser);
  }

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  async getCart() {
    return this.userService.getCart();
  }

  // @Post('cart')
  // @UseGuards(JwtAuthGuard)
  // async createCart(@Body() payload: CartDto) {
  //   return this.userService.createCart(payload);
  // }

  // @Post('order')
  // @UseGuards(JwtAuthGuard)
  // async createOrderForUser(
  //   @Body() payload: orderDto,
  //   @CurrentUser() currentUser: userEntity,
  // ) {
  //   return this.userService.createOrderForUser(payload, currentUser);
  // }
}
