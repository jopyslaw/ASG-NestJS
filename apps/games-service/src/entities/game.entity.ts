import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column()
  activated_from_date: Date;

  @Column()
  activated_to_date: Date;

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
}
