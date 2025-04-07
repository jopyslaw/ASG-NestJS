import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveGameDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
