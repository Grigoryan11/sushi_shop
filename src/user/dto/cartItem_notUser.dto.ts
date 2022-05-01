import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class CartItem_notUserDto {
  @Validate(Empty, { message: 'Quantity field is required' })
  quantity: number;

  @Validate(Empty, { message: 'Product field is required' })
  product: number;

  hash: string;
}
