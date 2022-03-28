import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminAuthService } from './admin_auth.service';
import { AdminDto } from './dto/admin.dto';
import { Change_passwordDto } from './dto/changePassword.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { JwtAuthGuard } from '../jwt.authGurad';

@Controller('admin-auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() admin: AdminDto) {
    return this.adminAuthService.login(admin);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Patch('changePassword')
  async change_password(@Body() admin: Change_passwordDto) {
    return this.adminAuthService.changePassword(admin);
  }

  @Post('email-forgot-password')
  async email_forgot_password() {
    return this.adminAuthService.sent_email_forgot_password();
  }
  @UsePipes(ValidationPipe)
  @Post('forgot-password')
  async forgot_password(@Body() admin: forgotPasswordDto) {
    return this.adminAuthService.forgot_password(admin);
  }
}
