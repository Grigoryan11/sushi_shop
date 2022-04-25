import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class Cart_item_updateDto {
  @Validate(Empty, { message: 'Quantity field is required' })
  quantity: number;
}
