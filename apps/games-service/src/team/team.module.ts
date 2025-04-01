import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from 'src/entities/team.entity';
import { GameService } from 'src/game/game.service';
import { Game } from 'src/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Game])],
  controllers: [TeamController],
  providers: [TeamService, GameService],
  exports: [TeamService],
})
export class TeamModule {}
