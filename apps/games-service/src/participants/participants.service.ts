import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participant } from 'src/entities/participant.entity';
import { Repository } from 'typeorm';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { TeamService } from 'src/team/team.service';
import { firstValueFrom } from 'rxjs';
import { GameService } from 'src/game/game.service';
import { RemoveParticipantDto } from './dto/remove-participant.dto';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
    @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private authServiceClient: ClientRMQ,
    private teamService: TeamService,
  ) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const user = await firstValueFrom(
      this.authServiceClient.send('findOneUser', createParticipantDto.user_id),
    );

    if (!user) {
      throw new NotFoundException();
    }

    const team = await this.teamService.findOne(createParticipantDto.team_id);

    console.log(team);

    if (!team.game.active) {
      throw new BadRequestException();
    }

    const acctualParticipantsInTeam = (
      await this.teamService.findAllByTeamId(createParticipantDto.team_id)
    ).length;

    console.log(team);

    if (acctualParticipantsInTeam >= team.max_number_of_players) {
      throw new BadRequestException();
    }

    const participantData = {
      user_id: createParticipantDto.user_id,
      team: team,
    };

    const participant = this.participantRepository.create(participantData);

    return await this.participantRepository.save(participant);
  }

  findAll() {
    return `This action returns all participants`;
  }

  async findOne(id: number) {
    const participant = await this.participantRepository.findOne({
      where: {
        id,
      },
    });

    if (!participant) {
      throw new NotFoundException();
    }

    return participant;
  }

  async update(id: number, updateParticipantDto: UpdateParticipantDto) {
    const participant = await this.findOne(id);

    if (participant.user_id !== updateParticipantDto.user_id) {
      throw new ForbiddenException();
    }

    const availableTeams = (
      await this.teamService.findAllByTeamId(participant.team.game.id)
    ).filter((item) => item.id !== participant.team.id);

    const numberOfPlayersInTeams = await Promise.all(
      availableTeams.map(async (team) => ({
        teamId: team.id,
        maxPlayersInTeam: team.max_number_of_players,
        numberOfParticipants: await this.getNumberOfPlayersInTeam(team.id),
      })),
    );

    const changeTeamId = numberOfPlayersInTeams.find(
      (team) => team.teamId === updateParticipantDto.team_id,
    );

    if (!changeTeamId) {
      throw new NotFoundException();
    }

    if (changeTeamId.numberOfParticipants >= changeTeamId.maxPlayersInTeam) {
      throw new ForbiddenException();
    }

    return await this.participantRepository.update(id, updateParticipantDto);
  }

  async remove(removeParticipantDto: RemoveParticipantDto) {
    const participant = await this.findOne(removeParticipantDto.id);

    if (participant.user_id !== removeParticipantDto.user_id) {
      throw new ForbiddenException();
    }

    return await this.participantRepository.remove([participant]);
  }

  async getNumberOfPlayersInTeam(teamId: number) {
    const team = await this.teamService.findOne(teamId);

    const participantsInTeam = await this.participantRepository.find({
      where: {
        team,
      },
    });

    return participantsInTeam.length;
  }
}
