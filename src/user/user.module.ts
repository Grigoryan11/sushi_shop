import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from '../db/entities/user.entity';
import { Order } from '../db/entities/order.entity';
import { Product } from '../db/entities/product.entity';
import { CartEntity } from '../db/entities/cart.entity';
import { BonusEntity } from '../db/entities/bonus.entity';
import { CartItemEntity } from '../db/entities/cart-Item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      userEntity,
      Order,
      Product,
      CartEntity,
      CartItemEntity,
      BonusEntity,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
