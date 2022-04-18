import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from './user.service';
import { ContactDto } from './dto/contact.dto';
import { orderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/jwt.authGurad';
import { CurrentUser } from '../auth/currentUser.decorator';
import { userEntity } from '../db/entities/user.entity';
import { FilterDto } from "../admin/dto/filter.dto";

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
