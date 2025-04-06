import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NewUserMailDto } from './dto/new-user-mail.dto';
import { GameStatusMailDto } from './dto/game-status-mail.dto';
import { ForgotPassworMailDto } from './dto/forgot-password-mail.dto';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern('sendNewUserMail')
  sendNewUserMail(@Payload() newUserMailDto: NewUserMailDto) {
    return this.notificationService.sendNewUserMail(newUserMailDto);
  }

  @MessagePattern('sendGameStatusMail')
  sendGamesStatusMail(@Payload() gameStatusMail: GameStatusMailDto) {
    return this.notificationService.sendGameStatusMail(gameStatusMail);
  }

  @MessagePattern('sendForgotPasswordMail')
  sendForgotPasswordMail(
    @Payload() forgotPasswordMailDto: ForgotPassworMailDto,
  ) {
    return this.notificationService.sendForgotPasswordMail(
      forgotPasswordMailDto,
    );
  }
}
