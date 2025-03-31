import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import rabbitmqAuthConfig from 'src/config/rabbitmq-auth.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserInfo]),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: rabbitmqAuthConfig,
          name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
        },
      ],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
