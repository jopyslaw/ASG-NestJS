import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import dbConfigDev from './config/db.config.dev';
import dbConfigProd from './config/db.config.prod';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import rabbitmqNotificationConfig from './config/rabbitmq-notification.config';
import { ClientsModule } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfigDev, dbConfigProd, rabbitmqNotificationConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV === 'production' ? dbConfigProd : dbConfigDev,
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: rabbitmqNotificationConfig,
          name: MICROSERVICES_CLIENTS.NOTIFICATION_SERVICE,
        },
      ],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
