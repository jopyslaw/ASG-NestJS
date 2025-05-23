import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { RemoveTeamDto } from './dto/remove-team.dto';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @MessagePattern('createTeam')
  create(@Payload() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @MessagePattern('findAllTeam')
  findAll() {
    return this.teamService.findAll();
  }

  @MessagePattern('findAllByGameId')
  findAllByGameId(gameId: number) {
    return this.teamService.findAllByGameId(gameId);
  }

  @MessagePattern('findOneTeam')
  findOne(@Payload() id: number) {
    return this.teamService.findOne(id);
  }

  @MessagePattern('updateTeam')
  update(@Payload() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(updateTeamDto.id, updateTeamDto);
  }

  @MessagePattern('removeTeam')
  remove(@Payload() removeTeamDto: RemoveTeamDto) {
    return this.teamService.remove(removeTeamDto);
  }
}
