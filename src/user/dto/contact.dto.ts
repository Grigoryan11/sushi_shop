import { IsEmail, IsString, Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class ContactDto {
  @Validate(Empty, { message: 'firstName field is required' })
  firstName: string;

  @Validate(Empty, { message: 'lastName field is required' })
  lastName: string;

  @IsEmail(Empty, { message: 'email field is required' })
  email: string;

  @Validate(Empty, { message: 'Phone field is required' })
  phone: number;

  @IsString()
  text: string;
}
