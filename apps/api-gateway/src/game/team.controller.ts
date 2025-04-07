import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';
import { CreateTeamDto } from './dto/create-team.dto';
import { RemoveTeamDto } from './dto/remove-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Controller('team')
export class TeamController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.GAMES_SERVICE)
    private gameServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-team')
  createTeam(@Body() teamData: CreateTeamDto, @Req() req) {
    const gameDataWithUserId = { ...teamData, user_id: req.user.sub };
    return this.gameServiceClient.send('createTeam', gameDataWithUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-team')
  removeTeam(@Body() removeTeamData: RemoveTeamDto, @Req() req) {
    const removeTeamDataWithUserId = {
      ...removeTeamData,
      user_id: req.user.sub,
    };
    return this.gameServiceClient.send('removeTeam', removeTeamDataWithUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-team')
  updateTeam(@Body() updateTeamData: UpdateTeamDto, @Req() req) {
    const updateTeamDataWithUserId = {
      ...updateTeamData,
      user_id: req.user.sub,
    };
    return this.gameServiceClient.send('updateTeam', updateTeamDataWithUserId);
  }
}
