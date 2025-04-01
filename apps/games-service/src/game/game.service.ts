import { firstValueFrom } from 'rxjs';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/entities/game.entity';
import { LessThan, Repository } from 'typeorm';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { DateTime, Duration } from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';

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
      activated_from_date: DateTime.fromISO(
        createGameDto.activated_from_date,
      ).toISODate(),
      activated_to_date: DateTime.fromISO(
        createGameDto.activated_to_date,
      ).toISODate(),
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

  async findOne(id: number) {
    const game = await this.gameRepository.findOne({
      where: {
        id,
      },
    });

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }

  @Cron('5 0 * * *')
  async activateGame() {
    const notActivatedGames = await this.getNotActivatedGames();

    if (notActivatedGames.length) {
      notActivatedGames.forEach((game) => {
        this.gameRepository.update(game.id, {
          active: true,
        });
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deactivateGame() {
    const activatedGames = await this.getActivatedGames();

    if (activatedGames.length) {
      activatedGames.forEach((game) => {
        this.gameRepository.update(game.id, {
          active: false,
        });
      });
    }
  }

  async getNotActivatedGames() {
    const games = await this.gameRepository.find({
      where: {
        active: false,
        activated_from_date: DateTime.now().toISODate(),
      },
    });

    return games;
  }

  async getActivatedGames() {
    const games = await this.gameRepository.find({
      where: {
        active: true,
        activated_to_date: LessThan(DateTime.now().toISODate()),
      },
    });

    return games;
  }
}
