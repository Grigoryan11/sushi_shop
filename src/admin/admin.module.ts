import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../db/entities/product.entity';
import { SlideEntity } from '../db/entities/slide.entity';
import { BonusEntity } from '../db/entities/bonus.entity';
import { CartItemEntity } from '../db/entities/cart-Item.entity';
import { CartEntity } from '../db/entities/cart.entity';
import { userEntity } from '../db/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      SlideEntity,
      BonusEntity,
      CartItemEntity,
      CartEntity,
      userEntity,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
