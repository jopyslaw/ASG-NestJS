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
import { In, LessThan, Repository } from 'typeorm';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { DateTime } from 'luxon';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RemoveGameDto } from './dto/remove-game.dto';
import { RemoveAllGamesDto } from './dto/remove-all-games.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private areaServiceClient: ClientRMQ,
    @Inject(MICROSERVICES_CLIENTS.NOTIFICATIONS_SERVICE)
    private notificationServiceClient: ClientRMQ,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const field = await firstValueFrom(
      this.areaServiceClient.send('findOneFieldInfo', createGameDto.field_id),
    );

    if (createGameDto.user_id !== field.area.owner_id) {
      throw new ForbiddenException();
    }

    const createGameDtoData = {
      description: createGameDto.description,
      created_by: createGameDto.user_id,
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

  async findAll() {
    return await this.gameRepository.find({});
  }

  async findAllActiveGames() {
    return await this.gameRepository.find({
      where: {
        active: true,
      },
    });
  }

  async findAllActiveGamesForFieldId(fieldId: number) {
    return await this.gameRepository.find({
      where: {
        active: true,
        field_id: fieldId,
      },
    });
  }

  async findAllGamesWithSameFieldId(fieldIds: number[]) {
    const games = await this.gameRepository.find({
      where: {
        field_id: In(fieldIds),
      },
      relations: ['team', 'team.participant'],
    });

    if (games.length === 0) {
      throw new NotFoundException();
    }

    return games;
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

  async update(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.findOne(id);

    const field = await firstValueFrom(
      this.areaServiceClient.send('findOneFieldInfo', game.field_id),
    ).catch((error) => {
      if (error.status === 404) {
        throw new NotFoundException();
      }
    });

    if (field.area.owner_id !== updateGameDto.user_id) {
      throw new ForbiddenException();
    }

    const { user_id, ...updateGameDtoWithoutUser } = updateGameDto;

    return await this.gameRepository.update(
      { id },
      {
        ...updateGameDtoWithoutUser,
        updated_at: DateTime.now().toISODate(),
        updated_by: user_id,
      },
    );
  }

  async remove(removeGameDto: RemoveGameDto) {
    const game = await this.findOne(removeGameDto.id);

    const field = await firstValueFrom(
      this.areaServiceClient.send('findOneFieldInfo', game.field_id),
    ).catch((error) => {
      if (error.status === 404) {
        throw new NotFoundException();
      }
    });

    if (field.area.owner_id !== removeGameDto.user_id) {
      throw new ForbiddenException();
    }

    return await this.gameRepository.remove([game]);
  }

  async removeAllGames(removeAllGamesDto: RemoveAllGamesDto) {
    const games = await this.findAllGamesWithSameFieldId(
      removeAllGamesDto.field_ids,
    );

    const field = await firstValueFrom(
      this.areaServiceClient.send('findOneFieldInfo', games.at(0).field_id),
    ).catch((error) => {
      if (error.status === 404) {
        throw new NotFoundException();
      }
    });

    if (field.area.owner_id !== removeAllGamesDto.user_id) {
      throw new ForbiddenException();
    }

    return await this.gameRepository.remove(games);
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

    const sendEmails = await Promise.all(
      activatedGames.map(async (game) => {
        await this.sendNotificationAboutGameStatus(game);
      }),
    );
  }

  async getNotActivatedGames() {
    const games = await this.gameRepository.find({
      where: {
        active: false,
        activated_from_date: DateTime.now().toISODate(),
      },
      relations: ['team', 'team.participant'],
    });

    return games;
  }

  async getActivatedGames() {
    const games = await this.gameRepository.find({
      where: {
        active: true,
        activated_to_date: LessThan(DateTime.now().toISODate()),
      },
      relations: ['team', 'team.participant'],
    });

    return games;
  }

  async sendNotificationAboutGameStatus(game: Game) {
    const participantsIds = game.team
      .map((team) => team.participant.map((participant) => participant.user_id))
      .flatMap((team) => team);

    const notficationGameStatusObject = {
      game_id: game.id,
      status:
        participantsIds.length >= game.min_number_of_participants
          ? true
          : false,
      participants_ids: participantsIds,
    };

    const sendStatus = await firstValueFrom(
      this.notificationServiceClient.send(
        'sendGameStatusMail',
        notficationGameStatusObject,
      ),
    );

    return sendStatus;
  }
}
