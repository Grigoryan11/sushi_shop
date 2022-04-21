import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class orderDto {
  @Validate(Empty, { message: 'FullName field is required' })
  fullName: string;

  @Validate(Empty, { message: 'Phone field is required' })
  phone: number;

  @Validate(Empty, { message: 'Address field is required' })
  address: string;

  @Validate(Empty, { message: 'Cart field is required' })
  cart: number;
}
