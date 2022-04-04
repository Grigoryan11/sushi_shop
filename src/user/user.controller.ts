import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ContactDto } from './dto/contact.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('contact')
  async contactUs(@Body() payload: ContactDto) {
    return this.userService.contactUs(payload);
  }
}
