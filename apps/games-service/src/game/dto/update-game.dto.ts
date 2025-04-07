import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateGameDto extends OmitType(PartialType(CreateGameDto), [
  'field_id',
  'max_number_of_participants',
  'number_of_teams',
]) {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
