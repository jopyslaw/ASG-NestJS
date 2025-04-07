import { firstValueFrom } from 'rxjs';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { In, Repository } from 'typeorm';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(MICROSERVICES_CLIENTS.NOTIFICATION_SERVICE)
    private notificationServiceClient: ClientRMQ,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userData = { ...createUserDto };
    const user = this.userRepository.create(userData);
    const createdUser = await this.userRepository.save(user);

    if (!createdUser) {
      throw new ForbiddenException();
    }

    const newUserMailData = {
      username: createdUser.username,
      email: createdUser.email,
    };

    await firstValueFrom(
      this.notificationServiceClient.send('sendNewUserMail', newUserMailData),
    ).catch((error) => {
      console.error('Błąd wysyłki wiadomości:', error);
    });
    return createdUser;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOneByLoginOrEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: [{ email }, { username: email }],
    });
    return user;
  }

  async updateHashRefreshToken(userId: number, hashedRefreshToken: string) {
    return await this.userRepository.update(
      { id: userId },
      { hashedRefreshToken },
    );
  }

  async updateHashForgotPasswordToken(
    userId: number,
    hashedResetPasswordToken: string,
  ) {
    return await this.userRepository.update(
      { id: userId },
      { hashedResetPasswordToken },
    );
  }

  async updatePassword(id: number, password: string) {
    return await this.userRepository.update(
      {
        id,
      },
      {
        hashedResetPasswordToken: null,
        password,
      },
    );
  }

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: ['hashedRefreshToken'],
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUsersEmails(user_ids: number[]) {
    const emails = await this.userRepository.find({
      where: {
        id: In(user_ids),
      },
      select: ['email', 'id'],
    });

    return emails;
  }
}
