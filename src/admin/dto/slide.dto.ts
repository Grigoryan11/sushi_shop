import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class SlideDto {
  @Validate(Empty, { message: 'Name field is required' })
  name: string;

  @Validate(Empty, { message: 'Name field is required' })
  about: string;

  @Validate(Empty, { message: 'Name field is required' })
  language: string;
}
