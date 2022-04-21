import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bonus')
export class BonusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bonus: number;

  @Column()
  limit: number;
}
