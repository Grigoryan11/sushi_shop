import { Matches, Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class orderDto {
  @Validate(Empty, { message: 'FullName field is required' })
  fullName: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[0-9]{3}[-\s\.]?[0-9]{3}$/im, {
    message: 'Not correct Phone number ',
  })
  phone: string;

  @Validate(Empty, { message: 'Address field is required' })
  address: string;

  bonus: number;
}
