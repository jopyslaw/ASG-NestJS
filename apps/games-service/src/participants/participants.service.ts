import {
  BadRequestException,
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

    if (!team.game.active) {
      throw new BadRequestException();
    }

    const acctualParticipantsInTeam = (
      await this.teamService.findAllByTeamId(createParticipantDto.team_id)
    ).length;

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

  findOne(id: number) {
    return `This action returns a #${id} participant`;
  }

  update(id: number, updateParticipantDto: UpdateParticipantDto) {
    return `This action updates a #${id} participant`;
  }

  remove(id: number) {
    return `This action removes a #${id} participant`;
  }
}
