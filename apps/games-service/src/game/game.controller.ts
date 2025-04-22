import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { RemoveGameDto } from './dto/remove-game.dto';
import { RemoveAllGamesDto } from './dto/remove-all-games.dto';

@Controller()
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @MessagePattern('createGame')
  create(@Payload() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @MessagePattern('findAllGame')
  findAll() {
    return this.gameService.findAll();
  }

  @MessagePattern('findAllActiveGames')
  findAllActiveGames() {
    return this.gameService.findAllActiveGames();
  }

  @MessagePattern('findAllActiveGamesForFieldId')
  findAllActiveGamesForFieldId(fieldId: number) {
    return this.gameService.findAllActiveGamesForFieldId(fieldId);
  }

  @MessagePattern('findOneGame')
  findOne(@Payload() id: number) {
    return this.gameService.findOne(id);
  }

  @MessagePattern('updateGame')
  update(@Payload() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @MessagePattern('removeGame')
  remove(@Payload() removeGameDto: RemoveGameDto) {
    return this.gameService.remove(removeGameDto);
  }

  @MessagePattern('removeAllGames')
  removeAllGames(@Payload() removeAllGamesDto: RemoveAllGamesDto) {
    return this.gameService.removeAllGames(removeAllGamesDto);
  }
}
