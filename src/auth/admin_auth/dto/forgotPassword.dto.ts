import { IsNotEmpty, Matches } from 'class-validator';

export class forgotPasswordDto {
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/, {
    message:
      'Password should contain minimum eight characters, at least one letter, one number and one special character',
  })
  new_pass: string;

  @IsNotEmpty()
  confirm_pass: string;
}
