import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';

@Controller('team')
export class TeamController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.GAMES_SERVICE)
    private gameServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-team')
  createTeam(@Body() teamData, @Req() req) {
    const gameDataWithUserId = { ...teamData, user_id: req.user.sub };
    return this.gameServiceClient.send('createTeam', gameDataWithUserId);
  }
}
