import { IsEmail, Validate, Matches, IsNotEmpty } from 'class-validator';
import { Empty } from '../../../middleware/empty.customValidator';
import validationMessage from '../../../middleware/validationMessage';

export class signInDto {
  @IsEmail({}, { message: validationMessage.email })
  email: string;

  @IsNotEmpty()
  password: string;
}

export class signUpDto {
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

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/, {
    message:
      'Password should contain minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
