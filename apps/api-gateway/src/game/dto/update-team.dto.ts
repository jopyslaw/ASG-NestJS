import { CreateTeamDto } from './create-team.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateTeamDto extends OmitType(PartialType(CreateTeamDto), [
  'game_id',
  'max_numbers_of_players',
]) {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;
}
