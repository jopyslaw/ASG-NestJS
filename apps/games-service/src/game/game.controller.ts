import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

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

  @MessagePattern('findOneGame')
  findOne(@Payload() id: number) {
    return this.gameService.findOne(id);
  }

  @MessagePattern('updateGame')
  update(@Payload() updateGameDto: UpdateGameDto) {
    return this.gameService.update(updateGameDto.id, updateGameDto);
  }

  @MessagePattern('removeGame')
  remove(@Payload() id: number) {
    return this.gameService.remove(id);
  }
}
