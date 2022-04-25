import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class BonusDto {
  @Validate(Empty, { message: 'Bonus field is required' })
  bonus: number;

  @Validate(Empty, { message: 'Price field is required' })
  limit: number;
}
