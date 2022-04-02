import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.authGurad';
import { CurrentUser } from '../auth/currentUser.decorator';
import { ProductDto } from './dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Helper } from '../config/upload.config';
import { diskStorage } from 'multer';
import { SlideDto } from './dto/slide.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('products')
  @UseGuards(JwtAuthGuard)
  async getProducts() {
    return this.adminService.getProducts();
  }

  @Get('products/:type')
  @UseGuards(JwtAuthGuard)
  async getProductById(@Param('type') type: string) {
    return this.adminService.getProductByType(type);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
      fileFilter: Helper.fileFilter,
    }),
  )
  async addProducts(
    @UploadedFile() image,
    @Body() payload: ProductDto,
    @CurrentUser() currentUser,
  ) {
    return this.adminService.addProducts(image, payload, currentUser);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  async deleteProducts(@Param('id') id: number, @CurrentUser() currentUser) {
    return this.adminService.deleteProduct(id, currentUser);
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
      fileFilter: Helper.fileFilter,
    }),
  )
  async updateProduct(
    @Param('id') id: number,
    @Body() payload: ProductDto,
    @UploadedFile() image,
  ) {
    return this.adminService.updateProduct(id, payload, image);
  }

  @Get('slide')
  @UseGuards(JwtAuthGuard)
  async getSlide() {
    return this.adminService.getSlide();
  }

  @Post('slide')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
      fileFilter: Helper.fileFilter,
    }),
  )
  async addSlide(
    @UploadedFile() image,
    @Body() payload: SlideDto,
    @CurrentUser() currentUser,
  ) {
    return this.adminService.addSlide(image, payload, currentUser);
  }

  @Delete('slide/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSlide(@Param('id') id: number, @CurrentUser() currentUser) {
    return this.adminService.deleteSlide(id, currentUser);
  }

  @Put('slide/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: Helper.destinationPath,
        filename: Helper.customFileName,
      }),
      fileFilter: Helper.fileFilter,
    }),
  )
  async updateSlide(
    @Param('id') id: number,
    @Body() payload: SlideDto,
    @UploadedFile() image,
  ) {
    return this.adminService.updateSlide(id, payload, image);
  }
}
