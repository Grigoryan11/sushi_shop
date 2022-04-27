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
  quantity: number;

  @ManyToOne(() => Product, (product) => product.cartItem)
  @JoinColumn()
  product: Product;

  // @ManyToOne(() => CartEntity)
  // cart: CartEntity;

  @ManyToOne(() => CartEntity, (cart) => cart.cartItem)
  cart: CartEntity;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
