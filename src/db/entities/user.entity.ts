import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CartEntity } from './cart.entity';

@Entity({
  name: 'users',
})
export class userEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  phone: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  bonus: number;

  @Column({ default: 0 })
  counter: number;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany(() => CartEntity, (cart) => cart.user)
  cart: CartEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
