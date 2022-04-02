import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../db/entities/product.entity';
import { SlideEntity } from '../db/entities/slide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, SlideEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
