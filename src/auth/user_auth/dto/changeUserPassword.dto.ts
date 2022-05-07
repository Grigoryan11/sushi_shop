import { IsNotEmpty, Matches } from 'class-validator';

export class ChangeUserPasswordDto {
  @IsNotEmpty()
  oldPassword: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&-])[A-Za-z\d@$!%*#?&-]{8,}$/, {
    message:
      'Password should contain minimum eight characters, at least one letter, one number and one special character',
  })
  newPassword: string;

  @IsNotEmpty()
  confirmPassword: string;
}
