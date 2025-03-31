import { firstValueFrom } from 'rxjs';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { Repository } from 'typeorm';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { DateTime } from 'luxon';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private areaServiceClient: ClientRMQ,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const field = await firstValueFrom(
      this.areaServiceClient.send('findOneFieldInfo', createGameDto.field_id),
    );

    if (createGameDto.user_id !== field.area.owner_id) {
      throw new ForbiddenException();
    }

    DateTime;

    const createGameDtoData = {
      description: createGameDto.description,
      created_by: createGameDto.field_id,
      active: createGameDto.active ? true : false,
      activated_from_date: DateTime.fromISO(createGameDto.activated_from_date),
      activated_to_date: DateTime.fromISO(createGameDto.activated_to_date),
      max_number_of_participants: createGameDto.max_number_of_participants,
      min_number_of_participants: createGameDto.min_number_of_participants,
      number_of_teams: createGameDto.number_of_teams,
      field_id: createGameDto.field_id,
    };

    const game = this.gameRepository.create(createGameDtoData);

    return await this.gameRepository.save(game);
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
