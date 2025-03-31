import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateGameDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsBoolean()
  active?: boolean;

  @IsNotEmpty()
  @IsNumber()
  field_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  number_of_teams: number;

  @IsNotEmpty()
  @IsDateString()
  activated_from_date: string;

  @IsNotEmpty()
  @IsDateString()
  activated_to_date: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  max_number_of_participants: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  min_number_of_participants: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
