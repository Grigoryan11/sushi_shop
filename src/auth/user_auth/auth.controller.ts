import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto, signUpDto } from './dto/auth.dto';
import { ChangeUserPasswordDto } from './dto/changeUserPassword.dto';
import { CurrentUser } from '../currentUser.decorator';
import { userEntity } from '../../db/entities/user.entity';
import { JwtAuthGuard } from '../jwt.authGurad';
import { sentEmailForgotPassword } from './dto/forgotPassword.dto';
import { forgotPasswordDto } from './dto/forgotPassword.dto';
import { CodeInterface, JwtInterface } from './interface/jwt.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() payload: signUpDto) {
    return this.authService.createUser(payload);
  }

  @Post('login')
  async userSignIn(@Body() payload: signInDto) {
    return this.authService.userSignIn(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('changeUserPassword')
  async changeUserPass(
    @CurrentUser() currentUser: userEntity,
    @Body() payload: ChangeUserPasswordDto,
  ) {
    return this.authService.changeUserPassword(currentUser, payload);
  }

  @Post('email-forgot-password')
  async email_forgot_password(@Body() payload: sentEmailForgotPassword) {
    return this.authService.sent_email_forgot_password(payload);
  }

  @Post('active')
  async token(@Body() data: CodeInterface) {
    return this.authService.confirmEmail(data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() payload: forgotPasswordDto) {
    return this.authService.forgot_password(payload);
  }
}
