import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
