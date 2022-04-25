import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class ProductDto {
  @Validate(Empty, { message: 'Name field is required' })
  name: string;

  @Validate(Empty, { message: 'Price field is required' })
  price: number;

  @Validate(Empty, { message: 'Description field is required' })
  description: string;

  @Validate(Empty, { message: 'type field is required' })
  type: string;

  @Validate(Empty, { message: 'Language field is required' })
  language: string;

  sale: number;

  saleDataStart: Date;

  saleDataEnd: Date;
}
