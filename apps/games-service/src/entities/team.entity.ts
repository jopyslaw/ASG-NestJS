import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

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

  @Column()
  acctual_number_of_player: number;

  @ManyToOne(() => Game, (game) => game.id, { eager: true })
  event: Game;
}
