import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Area } from './area.entity';

@Entity()
export class FieldInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column({
    nullable: false,
  })
  max_players_number: number;

  @Column({
    nullable: false,
  })
  min_players_number: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  created_by: number;

  @Column({
    nullable: true,
  })
  updated_by: number;

  @Column({
    nullable: true,
  })
  updated_at: Date;

  @ManyToOne(() => Area, (area) => area.id, { eager: true })
  @JoinColumn()
  area: Area;
}
