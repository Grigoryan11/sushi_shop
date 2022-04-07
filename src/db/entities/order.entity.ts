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
import { userEntity } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  phone: number;

  // @Column()
  // email: string;

  @Column()
  address: string;

  @Column({ default: 1, nullable: true })
  quantity: number;

  @ManyToOne(() => userEntity, (user) => user.order)
  @JoinColumn()
  user: userEntity;

  @ManyToOne(() => Product, (product) => product.order)
  @JoinColumn()
  product: Product[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
