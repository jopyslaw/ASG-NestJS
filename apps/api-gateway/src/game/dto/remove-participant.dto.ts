import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveParticipantDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;
}
