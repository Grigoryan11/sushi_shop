import { IsEmail, Matches, Validate } from 'class-validator';
import { Empty } from '../../../middleware/empty.customValidator';

export class ChangeDataDto {
  firstName: string;

  lastName: string;

  phone: number;
}
