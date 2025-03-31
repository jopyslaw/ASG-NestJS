import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFieldInfoDto {
  @IsString()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  max_players_number: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  min_players_number: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsNumber()
  @IsNotEmpty()
  area_id: number;
}
