import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateParticipantDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  team_id: number;
}
