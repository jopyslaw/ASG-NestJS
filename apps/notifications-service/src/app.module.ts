import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './notification/notification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Client, ClientsModule } from '@nestjs/microservices';
import rabbitmqAuthConfig from './config/rabbitmq-auth.config';
import { MICROSERVICES_CLIENTS } from './constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    NotificationModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'konradpraktykife@gmail.com',
          pass: 'gavo rweq wiiv jywz',
        },
      },
      defaults: {
        from: '"From Name" ',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          useFactory: rabbitmqAuthConfig,
          name: MICROSERVICES_CLIENTS.AUTH_SERVICE,
        },
      ],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
