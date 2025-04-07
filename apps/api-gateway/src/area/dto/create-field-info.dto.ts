import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFieldInfoDto {
  @IsString()
  @ApiProperty()
  description: string;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  @Min(2)
  max_players_number: number;

  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  @Min(2)
  min_players_number: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  area_id: number;
}
