import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { userEntity } from './user.entity';
import { CartItemEntity } from './cart-Item.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => userEntity, (user) => user.cart)
  @JoinColumn()
  user: userEntity;
}
