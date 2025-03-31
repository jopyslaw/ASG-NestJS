import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ClientsModule } from '@nestjs/microservices';
import rabbitmqNotificationConfig from 'src/config/rabbitmq-notification.config';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: rabbitmqNotificationConfig,
          name: MICROSERVICES_CLIENTS.NOTIFICATION_SERVICE,
        },
      ],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, ClientsModule],
})
export class UserModule {}
