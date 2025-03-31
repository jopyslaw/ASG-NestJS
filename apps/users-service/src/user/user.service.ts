import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    let user = await firstValueFrom(
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
