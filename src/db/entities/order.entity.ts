import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
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

  @Column()
  address: string;

  // @Column({ default: 1, nullable: true })
  // quantity: number;

  @ManyToOne(() => userEntity, (user) => user.order)
  @JoinColumn()
  user: userEntity;

  @ManyToMany(() => Product, (product) => product.order)
  @JoinTable()
  product: Product[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
