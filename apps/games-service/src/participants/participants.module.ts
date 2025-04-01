import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from 'src/entities/participant.entity';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import rabbitmqAuthConfig from 'src/config/rabbitmq-auth.config';
import { TeamService } from 'src/team/team.service';
import { Team } from 'src/entities/team.entity';
import { GameService } from 'src/game/game.service';
import { Game } from 'src/entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Participant, Team, Game]),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: rabbitmqAuthConfig,
          name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
        },
      ],
    }),
  ],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, TeamService, GameService],
})
export class ParticipantsModule {}
