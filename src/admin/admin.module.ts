import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../db/entities/product.entity';
import { SlideEntity } from '../db/entities/slide.entity';
import { BonusEntity } from '../db/entities/bonus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, SlideEntity, BonusEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
