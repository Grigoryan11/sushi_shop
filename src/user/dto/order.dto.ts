import { IsEmail, IsNotEmpty, Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';
import { Product } from '../../db/entities/product.entity';

export class orderDto {
  @Validate(Empty, { message: 'fullName field is required' })
  fullName: string;

  // @IsEmail(Empty, { message: 'email field is required' })
  // email: string;

  @Validate(Empty, { message: 'Phone field is required' })
  phone: number;

  @Validate(Empty, { message: 'Address field is required' })
  address: string;

  // @IsNotEmpty()
  // quantity: number;

  @Validate(Empty, { message: 'Product field is required' })
  product: Product[];
}
