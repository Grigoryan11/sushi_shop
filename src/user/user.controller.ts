import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { Cart_item_updateDto } from './dto/cart_item_update.dto';
import { CartItem_notUserDto } from './dto/cartItem_notUser.dto';
import { OrderNotUserDto } from './dto/orderNotUser.dto';
import { HashForDeleteDto } from './dto/hashForDelete.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('contact')
  async contactUs(@Body() payload: ContactDto) {
    return this.userService.contactUs(payload);
  }

  @Get('data')
  @UseGuards(JwtAuthGuard)
  async getUserData(@CurrentUser() currentUser) {
    return this.userService.getUserData(currentUser);
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

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  async getCart(@CurrentUser() currentUser) {
    return this.userService.getCart(currentUser);
  }

  @Post('cart-user')
  @UseGuards(JwtAuthGuard)
  async createCartAuthUser(
    @Body() payload: Cart_itemDto,
    @CurrentUser() currentUser,
  ) {
    return this.userService.createCartAuthUser(payload, currentUser);
  }

  @Delete('cart-user/:id')
  @UseGuards(JwtAuthGuard)
  async deleteCartItemUser(
    @Param('id') id: number,
    @CurrentUser() currentUser,
  ) {
    return this.userService.deleteCartItemUser(id, currentUser);
  }

  @Patch('cart-user/:id')
  @UseGuards(JwtAuthGuard)
  async updateCartItemUser(
    @Param('id') id: number,
    @CurrentUser() currentUser,
    @Body() payload: Cart_item_updateDto,
  ) {
    return this.userService.updateCartItemUser(id, currentUser, payload);
  }

  @Post('order-user')
  @UseGuards(JwtAuthGuard)
  async createOrderForUser(
    @Body() payload: orderDto,
    @CurrentUser() currentUser,
  ) {
    return this.userService.createOrderForUser(payload, currentUser);
  }

  @Post('cart')
  async createCartUser(@Body() payload: CartItem_notUserDto) {
    return this.userService.createCartUser(payload);
  }

  @Post('order')
  async createOrder(@Body() payload: OrderNotUserDto) {
    return this.userService.createOrder(payload);
  }

  @Delete('cart/:id')
  async deleteCartItem(
    @Param('id') id: number,
    @Body() payload: HashForDeleteDto,
  ) {
    return this.userService.deleteCartItem(id, payload);
  }

  @Patch('cart/:id')
  async updateCartItem(
    @Param('id') id: number,
    @Body() payload: Cart_item_updateDto,
  ) {
    return this.userService.updateCartItem(id, payload);
  }
}
