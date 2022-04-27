import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { userEntity } from './user.entity';
import { CartItemEntity } from './cart-Item.entity';
import { Order } from './order.entity';

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

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  cartItem: CartItemEntity[];

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;
}
