import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartItemEntity } from './cart-Item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  price: number;

  @Column()
  type: string;

  @Column()
  language: string;

  @Column()
  description: string;

  // @Column({ default: 0 })
  // sale: number;
  //
  // @Column({ nullable: true })
  // saleDataStart?: Date;
  //
  // @Column({ nullable: true })
  // saleDataEnd?: Date;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.product)
  cartItem: CartItemEntity[];
}
