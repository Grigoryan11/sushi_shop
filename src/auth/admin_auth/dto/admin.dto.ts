import { IsString, IsEmail, Validate } from 'class-validator';
import { Empty } from '../../../middleware/empty.customValidator';

export class AdminDto {
  @IsString()
  @Validate(Empty, { message: 'Email field is required' })
  @IsEmail()
  email: string;

  @IsString()
  @Validate(Empty, { message: 'Password field is required' })
  password: string;
}
