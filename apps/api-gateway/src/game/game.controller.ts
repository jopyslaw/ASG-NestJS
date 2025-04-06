import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';

@Controller('game')
export class GameController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.GAMES_SERVICE)
    private gameServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-game')
  createGame(@Body() gameData, @Req() req) {
    const gameDataWithUserId = { ...gameData, user_id: req.user.sub };
    return this.gameServiceClient.send('createGame', gameDataWithUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-game')
  removeGame(@Body() removeGameData, @Req() req) {
    const removeGameDataWithUserId = {
      ...removeGameData,
      user_id: req.user.sub,
    };
    return this.gameServiceClient.send('removeGame', removeGameDataWithUserId);
  }
}
