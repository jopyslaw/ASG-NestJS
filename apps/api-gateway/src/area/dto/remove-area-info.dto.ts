import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveAreaInfoDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
