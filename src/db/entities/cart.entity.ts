import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  hash: string;

  @ManyToOne(() => userEntity, (user) => user.cart)
  @JoinColumn()
  user: userEntity;

  @OneToMany(() => CartItemEntity, (item) => item.cart)
  cartItem: CartItemEntity[];

  @OneToOne(() => Order, (order) => order.cart)
  order: Order;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
