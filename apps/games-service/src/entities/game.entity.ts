import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  created_by: number;

  @Column({
    default: null,
    nullable: true,
  })
  updated_at: Date;

  @Column({
    default: null,
    nullable: true,
  })
  updated_by: number;

  @Column({
    type: 'date',
  })
  activated_from_date: string;

  @Column({
    type: 'date',
  })
  activated_to_date: string;

  @Column()
  max_number_of_participants: number;

  @Column()
  min_number_of_participants: number;

  @Column()
  number_of_teams: number;

  @Column()
  field_id: number;

  @Column({
    default: false,
  })
  active: boolean;

  @OneToMany(() => Team, (team) => team.game, { cascade: true })
  team: Team[];
}
