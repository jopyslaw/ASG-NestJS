import {
  Column,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => Game, (game) => game.id, { eager: true })
  game: Game;

  @OneToOne(() => Participant, (participant) => participant.team)
  participant: Participant;
}
