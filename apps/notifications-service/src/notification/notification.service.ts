import { Inject, Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { NewUserMailDto } from './dto/new-user-mail.dto';
import { GameStatusMailDto } from './dto/game-status-mail.dto';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ForgotPassworMailDto } from './dto/forgot-password-mail.dto';

@Injectable()
export class NotificationService {
  constructor(
    private mailerService: MailerService,
    @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private authClientService: ClientRMQ,
  ) {}

  async sendNewUserMail(newUserMailDto: NewUserMailDto) {
    const mailConfiguration: ISendMailOptions = {
      to: newUserMailDto.email,
      subject: 'Welcome to our service',
      template: 'new_user',
      context: { username: newUserMailDto.username },
    };

    const result = await this.mailerService.sendMail(mailConfiguration);
    return result;
  }

  async sendGameStatusMail(gameStatusMailDto: GameStatusMailDto) {
    const usersEmails = await firstValueFrom(
      this.authClientService.send(
        'getUsersEmails',
        gameStatusMailDto.participants_ids,
      ),
    );

    if (usersEmails.length === 0) {
      return;
    }

    const configuredMail = usersEmails.map((user) => {
      const mailConfiguration: ISendMailOptions = {
        to: user.email,
        subject: 'Game will be accepted',
        template: gameStatusMailDto.status
          ? 'game_accepted'
          : 'game_unaccepted',
      };

      return this.mailerService.sendMail(mailConfiguration);
    });

    return await Promise.all(configuredMail);
  }

  async sendForgotPasswordMail(forgotPasswordMailDto: ForgotPassworMailDto) {
    const passwordResetLink =
      'http://localhost:3000/reset-password?token=' +
      forgotPasswordMailDto.token;

    const mailConfiguration: ISendMailOptions = {
      to: forgotPasswordMailDto.email,
      subject: 'Password reset link',
      template: 'password_reset',
      context: { password_reset_link: passwordResetLink },
    };

    return await this.mailerService.sendMail(mailConfiguration);
  }
}
