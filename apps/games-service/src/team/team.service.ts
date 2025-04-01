import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from 'src/entities/team.entity';
import { Repository } from 'typeorm';
import { GameService } from 'src/game/game.service';
import { firstValueFrom } from 'rxjs';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamRepository: Repository<Team>,
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private areaServiceClient: ClientRMQ,
    private gameService: GameService,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    const game = await this.gameService.findOne(createTeamDto.game_id);

    const field = await firstValueFrom(
      this.areaServiceClient.send('findOneFieldInfo', game.field_id),
    ).catch((error) => {
      if (error.status === 404) {
        throw new NotFoundException();
      }
    });

    if (field.area.owner_id !== createTeamDto.user_id) {
      throw new ForbiddenException();
    }

    const acctualNumberOfTeams = (
      await this.findAllByTeamId(createTeamDto.game_id)
    ).length;

    if (acctualNumberOfTeams >= game.number_of_teams) {
      throw new BadRequestException();
    }

    const teamDataDto = {
      name: createTeamDto.name,
      max_number_of_players: createTeamDto.max_numbers_of_players,
      game: game,
    };

    const team = this.teamRepository.create(teamDataDto);

    return await this.teamRepository.save(team);
  }

  async findAll() {
    return await this.teamRepository.find();
  }

  async findAllByTeamId(game_id: number) {
    const teams = await this.teamRepository.find({
      where: {
        game: {
          id: game_id,
        },
      },
    });

    return teams;
  }

  async findOne(id: number) {
    const team = await this.teamRepository.findOne({
      where: {
        id,
      },
    });

    if (!team) {
      throw new NotFoundException();
    }

    return team;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
