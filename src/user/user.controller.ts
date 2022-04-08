import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { ContactDto } from './dto/contact.dto';
import { orderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt.authGurad';
import { CurrentUser } from '../auth/currentUser.decorator';
import { userEntity } from '../db/entities/user.entity';

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
  async getProductById(@Query('type') type: string) {
    return this.userService.getProductByType(type);
  }

  @Get('product-lang')
  async getProductByLang(@Query('language') language: string) {
    return this.userService.getProductByLang(language);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getOrders(@CurrentUser() currentUser) {
    return this.userService.getOrders(currentUser);
  }

  @Post('order')
  @UseGuards(JwtAuthGuard)
  async createOrderForUser(
    @Body() payload: orderDto,
    @CurrentUser() currentUser: userEntity,
  ) {
    return this.userService.createOrderForUser(payload, currentUser);
  }
}
