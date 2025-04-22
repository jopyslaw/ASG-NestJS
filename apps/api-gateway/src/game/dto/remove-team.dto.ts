import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveTeamDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
