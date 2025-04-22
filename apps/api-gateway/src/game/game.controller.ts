import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { RemoveGameDto } from './dto/remove-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Controller('game')
export class GameController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.GAMES_SERVICE)
    private gameServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-game')
  createGame(@Body() gameData: CreateGameDto, @Req() req) {
    const gameDataWithUserId = { ...gameData, user_id: req.user.sub };
    return this.gameServiceClient.send('createGame', gameDataWithUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-game')
  removeGame(@Body() removeGameData: RemoveGameDto, @Req() req) {
    const removeGameDataWithUserId = {
      ...removeGameData,
      user_id: req.user.sub,
    };
    return this.gameServiceClient.send('removeGame', removeGameDataWithUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-game')
  updateGame(@Body() updateGameData: UpdateGameDto, @Req() req) {
    const updateGameDataWithUserId = {
      ...updateGameData,
      user_id: req.user.sub,
    };
    return this.gameServiceClient.send('updateGame', updateGameDataWithUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-all-game')
  findAllGame() {
    return this.gameServiceClient.send('findAllGame', {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-all-active-game')
  findAllActiveGames() {
    return this.gameServiceClient.send('findAllActiveGames', {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-all-active-game-for-field-id')
  findAllActiveGamesForFieldId(@Query('fieldId') fieldId: number) {
    return this.gameServiceClient.send('findAllActiveGamesForFieldId', fieldId);
  }
}
