import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import validationMessage from '../../../middleware/validationMessage';

export class sentEmailForgotPassword {
  @IsEmail({}, { message: validationMessage.email })
  email: string;
}

export class forgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  new_pass: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  confirm_pass: string;

  @IsString()
  @IsNotEmpty()
  data: string;
}
