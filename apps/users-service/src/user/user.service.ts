import { RemoveUserDto } from './dto/remove-user.dto';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from 'src/entities/user-info.entity';
import { Repository } from 'typeorm';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserInfo) private userRepository: Repository<UserInfo>,
    @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private areaAuthServiceClient: ClientRMQ,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExist = await this.checkIfUserWithProviedIdExist(
      createUserDto.user_id,
    );

    if (!isUserExist) {
      throw new NotFoundException();
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async checkIfUserWithProviedIdExist(userId: number) {
    const user = await firstValueFrom(
      this.areaAuthServiceClient.send('findOneUser', userId),
    );

    if (!user) {
      return false;
    }

    return true;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const userInfo = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userInfo) {
      throw new NotFoundException();
    }

    return userInfo;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userInfo = await this.findOne(id);

    if (userInfo.user_id !== updateUserDto.user_id) {
      throw new ForbiddenException();
    }

    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(removeUserDto: RemoveUserDto) {
    const userInfo = await this.findOne(removeUserDto.id);

    if (userInfo.user_id !== removeUserDto.user_id) {
      throw new ForbiddenException();
    }

    return await this.userRepository.remove([userInfo]);
  }
}
