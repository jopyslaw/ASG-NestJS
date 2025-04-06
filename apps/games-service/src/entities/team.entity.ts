import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Participant } from './participant.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column()
  max_number_of_players: number;

  @ManyToOne(() => Game, (game) => game.team, { onDelete: 'CASCADE' })
  game: Game;

  @OneToMany(() => Participant, (participant) => participant.team, {
    cascade: true,
  })
  participant: Participant[];
}
