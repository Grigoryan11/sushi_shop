import { Validate } from 'class-validator';
import { Empty } from '../../middleware/empty.customValidator';

export class SlideDto {
  @Validate(Empty, { message: 'Title field is required' })
  title: string;

  @Validate(Empty, { message: 'Text field is required' })
  text: string;

  @Validate(Empty, { message: 'Language field is required' })
  language: string;
}
