import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveFieldInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
