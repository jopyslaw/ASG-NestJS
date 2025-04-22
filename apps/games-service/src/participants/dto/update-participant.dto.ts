import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipantDto } from './create-participant.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  team_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
