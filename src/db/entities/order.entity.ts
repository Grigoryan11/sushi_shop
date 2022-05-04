import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CartEntity } from './cart.entity';

export enum Status {
  Done = 'done',
  Waiting = 'waiting',
  Canceled = 'canceled',
}

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: number;

  @Column()
  address: string;

  @Column({ default: 0 })
  bonus: number;

  @Column({ nullable: true })
  totalPrice: number;

  @Column({ type: 'enum', enum: Status, default: Status.Waiting })
  status: Status;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToOne(() => CartEntity, (cart) => cart.order)
  @JoinColumn()
  cart: CartEntity;
}
