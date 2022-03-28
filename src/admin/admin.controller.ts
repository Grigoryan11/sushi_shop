import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.authGurad';
import { ProductDto } from './dto/product.dto';
import { CurrentUser } from '../auth/currentUser.decorator';
import { userEntity } from '../db/entities/user.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add-product')
  async addProduct(
    @Body() payload: ProductDto,
    @CurrentUser() currentUser: userEntity,
  ) {
    return this.adminService.addProduct(payload, currentUser);
  }
}
