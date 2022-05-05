import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bonus')
export class BonusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  bonus: number;

  @Column({ default: 0 })
  limit: number;
}
