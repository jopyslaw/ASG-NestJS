import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwtConfig';
import { JwtAuthGuard } from './guards/jwt-guard/jwt-guard.guard';
import { AreaController } from './area/area.controller';
import { AreaInfoController } from './area/area-info.controller';
import { FieldInfoController } from './area/field-info.controller';
import { UserInfoController } from './user-info/user-info.controller';
import { GameController } from './game/game.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ClientsModule.register([
      {
        name: MICROSERVICES_CLIENTS.USERS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`,
          ],
          queue: 'users_queue',
          queueOptions: {
            durable: false,
            persistent: false,
          },
        },
      },
      {
        name: MICROSERVICES_CLIENTS.AREAS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`,
          ],
          queue: 'areas_queue',
          queueOptions: {
            durable: false,
            persistent: false,
          },
        },
      },
      {
        name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`,
          ],
          queue: 'auth_queue',
          queueOptions: {
            durable: false,
            persistent: false,
          },
        },
      },
      {
        name: MICROSERVICES_CLIENTS.GAMES_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`,
          ],
          queue: 'games_queue',
          queueOptions: {
            durable: false,
            persistent: false,
          },
        },
      },
      {
        name: MICROSERVICES_CLIENTS.NOTIFICATIONS_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [
            `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:5672`,
          ],
          queue: 'notifications_queue',
          queueOptions: {
            durable: false,
            persistent: false,
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    AreaController,
    AreaInfoController,
    FieldInfoController,
    UserInfoController,
    GameController,
  ],
  providers: [AppService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AppModule {}
