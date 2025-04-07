import { CreateGameDto } from './create-game.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateGameDto extends OmitType(PartialType(CreateGameDto), [
  'field_id',
  'max_number_of_participants',
  'number_of_teams',
]) {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;
}
