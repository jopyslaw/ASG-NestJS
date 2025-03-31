import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { NewUserMailDto } from './dto/new-user-mail.dto';

@Injectable()
export class NotificationService {
  constructor(private mailerService: MailerService) {}

  async sendNewUserMail(newUserMailDto: NewUserMailDto) {
    console.log(__dirname);
    const mailConfiguration: ISendMailOptions = {
      to: newUserMailDto.email,
      subject: 'Welcome tou our service',
      template: 'new_user',
      context: { username: newUserMailDto.username },
    };

    const result = await this.mailerService.sendMail(mailConfiguration);
    console.log(result);
    return result;
  }

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
