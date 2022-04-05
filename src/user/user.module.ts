import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userEntity } from '../db/entities/user.entity';
import { Order } from '../db/entities/order.entity';
import { Product } from '../db/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([userEntity, Order, Product])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
