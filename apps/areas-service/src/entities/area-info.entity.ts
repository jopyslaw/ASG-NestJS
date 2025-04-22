import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Area } from './area.entity';

@Entity()
export class AreaInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    nullable: true,
  })
  last_updated_at: Date;

  @Column({
    nullable: true,
  })
  updated_by: number;

  @OneToOne(() => Area, (area) => area.area_info, { onDelete: 'CASCADE' })
  @JoinColumn()
  area: Area;
}
