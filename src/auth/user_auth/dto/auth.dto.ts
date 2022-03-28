import { IsEmail, Validate, Matches } from 'class-validator';
import { Empty } from '../../../middleware/empty.customValidator';
import validationMessage from '../../../middleware/validationMessage';

export class signInDto {
  @IsEmail({}, { message: validationMessage.email })
  email: string;

  @Validate(Empty, { message: 'Password field is required' })
  password: string;
}

export class signUpDto {
  @Validate(Empty, { message: 'firstName field is required' })
  firstName: string;

  @Validate(Empty, { message: 'lastName field is required' })
  lastName: string;

  @IsEmail({}, { message: 'email field is required' })
  email: string;

  @Validate(Empty, { message: 'Phone field is required' })
  phone: number;

  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @Validate(Empty, { message: 'Password field is required' })
  password: string;

  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  @Validate(Empty, { message: 'Password field is required' })
  confirmPassword: string;
}
