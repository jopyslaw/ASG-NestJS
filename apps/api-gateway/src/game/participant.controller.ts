import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';

@Controller('participant')
export class ParticipantController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.GAMES_SERVICE)
    private gameServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-participant')
  addParticipant(@Body() participantData, @Req() req) {
    const gameDataWithUserId = { ...participantData, user_id: req.user.sub };
    return this.gameServiceClient.send('createParticipant', gameDataWithUserId);
  }
}
