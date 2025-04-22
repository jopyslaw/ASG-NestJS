import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  description: string;

  @IsBoolean()
  @ApiProperty()
  active?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  field_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @ApiProperty()
  number_of_teams: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  activated_from_date: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  activated_to_date: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @ApiProperty()
  max_number_of_participants: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(2)
  @ApiProperty()
  min_number_of_participants: number;
}
