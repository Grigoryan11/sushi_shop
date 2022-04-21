import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class CartDto {
  count: number;

  @Validate(Empty, { message: 'Product field is required' })
  product: number;
}
