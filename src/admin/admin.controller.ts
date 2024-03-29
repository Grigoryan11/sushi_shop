import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { UpdateDto } from './dto/update.dto';
import { BonusDto } from './dto/bonus.dto';
import { StatusDto } from './dto/status.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('products')
  async getProducts() {
    return this.adminService.getProducts();
  }

  @Get('product')
  async getProduct(
    @Query('type') type: string,
    @Query('language') language: string,
  ) {
    return this.adminService.getProduct(type, language);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async getOrders(@CurrentUser() currentUser) {
    return this.adminService.getOrders(currentUser);
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

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: number, @Body() payload: UpdateDto) {
    return this.adminService.updateProduct(id, payload);
  }

  @Patch('products/image/:id')
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
  async updateProductImage(@Param('id') id: number, @UploadedFile() image) {
    return this.adminService.updateProductImage(id, image);
  }

  @Get('slide')
  async getSlide() {
    return this.adminService.getSlide();
  }

  @Get('slide-lang')
  async getSlideByLang(@Query('language') language: string) {
    return this.adminService.getSlideByLang(language);
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

  @Patch('slide/:id')
  @UseGuards(JwtAuthGuard)
  async updateSlide(@Param('id') id: number, @Body() payload: SlideDto) {
    return this.adminService.updateSlide(id, payload);
  }

  @Patch('slide/image/:id')
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
  async updateSlideImage(@Param('id') id: number, @UploadedFile() image) {
    return this.adminService.updateSlideImage(id, image);
  }

  @Post('bonus')
  @UseGuards(JwtAuthGuard)
  async createBonus(@Body() payload: BonusDto) {
    return this.adminService.createBonus(payload);
  }

  @Get('bonus')
  @UseGuards(JwtAuthGuard)
  async getBonus(@CurrentUser() currentUser) {
    return this.adminService.getBonus(currentUser);
  }

  @Patch('bonus/:id')
  @UseGuards(JwtAuthGuard)
  async updateBonus(
    @Body() payload: BonusDto,
    @Param('id') id: number,
    @CurrentUser() currentUser,
  ) {
    return this.adminService.updateBonus(id, payload, currentUser);
  }

  @Patch('status/:id')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: number,
    @Body() payload: StatusDto,
    @CurrentUser() currentUser,
  ) {
    return this.adminService.updateStatus(id, payload, currentUser);
  }
}
