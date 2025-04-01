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
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  max_numbers_of_players: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  game_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  user_id: number;
}
