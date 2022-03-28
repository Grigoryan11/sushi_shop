import { IsString, Matches, MinLength, Validate } from 'class-validator';
import { Empty } from '../../../middleware/empty.customValidator';

export class ChangeUserPasswordDto {
  @Validate(Empty, { message: 'oldPassword field is required' })
  oldPassword: string;

  @Validate(Empty, { message: 'newPassword field is required' })
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  newPassword: string;

  @Validate(Empty, { message: 'confirmPassword field is required' })
  confirmPassword: string;
}
