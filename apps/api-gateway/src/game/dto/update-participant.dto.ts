import { CreateParticipantDto } from './create-participant.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  team_id: number;
}
