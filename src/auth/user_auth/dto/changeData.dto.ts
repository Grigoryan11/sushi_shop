import { Matches } from 'class-validator';

export class ChangeDataDto {
  firstName: string;

  lastName: string;

  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[0-9]{3}[-\s\.]?[0-9]{3}$/im, {
    message: 'Not correct Phone number ',
  })
  phone: string;
}
