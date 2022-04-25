import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ContactDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../auth/jwt.authGurad';
import { CurrentUser } from '../auth/currentUser.decorator';
import { Cart_itemDto } from './dto/cart_item.dto';
import { orderDto } from './dto/order.dto';

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

  @Post('cart')
  @UseGuards(JwtAuthGuard)
  async createCartAuthUser(
    @Body() payload: Cart_itemDto,
    @CurrentUser() currentUser,
  ) {
    return this.userService.createCartAuthUser(payload, currentUser);
  }

  @Delete('cart/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCartItem(@Param('id') id: number, @CurrentUser() currentUser) {
    return this.userService.deleteCartItem(id, currentUser);
  }

  @Post('order')
  @UseGuards(JwtAuthGuard)
  async createOrderForUser(
    @Body() payload: orderDto,
    @CurrentUser() currentUser,
  ) {
    return this.userService.createOrderForUser(payload, currentUser);
  }
}
