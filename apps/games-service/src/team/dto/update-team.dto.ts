import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateTeamDto } from './create-team.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTeamDto extends OmitType(PartialType(CreateTeamDto), [
  'game_id',
  'max_numbers_of_players',
]) {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
