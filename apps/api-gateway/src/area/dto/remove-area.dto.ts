import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveAreaDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
