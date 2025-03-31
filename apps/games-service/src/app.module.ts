import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GameModule } from './game/game.module';
import { TeamModule } from './team/team.module';
import { ParticipantsModule } from './participants/participants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfigDev from './config/db.config.dev';
import dbConfigProd from './config/db.config.prod';
import { ClientsModule } from '@nestjs/microservices';
import rabbitmqAreaConfig from './config/rabbitmq-area.config';
import { MICROSERVICES_CLIENTS } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfigDev, dbConfigProd, rabbitmqAreaConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbConfigProd : dbConfigDev,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: rabbitmqAreaConfig,
          name: MICROSERVICES_CLIENTS.AREAS_SERVICE,
        },
      ],
      isGlobal: true,
    }),
    GameModule,
    TeamModule,
    ParticipantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
