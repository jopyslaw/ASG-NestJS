import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  @ApiProperty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  max_numbers_of_players: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @ApiProperty()
  game_id: number;
}
