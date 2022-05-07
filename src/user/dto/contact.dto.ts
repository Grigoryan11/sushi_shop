import { IsEmail, IsString, Matches, Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class ContactDto {
  @Validate(Empty, { message: 'firstName field is required' })
  firstName: string;

  @Validate(Empty, { message: 'lastName field is required' })
  lastName: string;

  @IsEmail()
  email: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[0-9]{3}[-\s\.]?[0-9]{3}$/im, {
    message: 'Not correct Phone number ',
  })
  phone: string;

  @IsString()
  text: string;
}
