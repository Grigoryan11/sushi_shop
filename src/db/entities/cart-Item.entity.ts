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
import { Product } from './product.entity';
import { CartEntity } from './cart.entity';

@Entity('cart_item')
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 1 })
  count: number;

  @OneToOne(() => Product)
  @JoinColumn()
  product: Product;

  @OneToMany(() => CartEntity, (cart) => cart.cartItem)
  @JoinColumn()
  cart: CartEntity;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
