import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAreaDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(10)
  number_of_fields: number;

  @IsNotEmpty()
  @IsString()
  coordinates_of_place: string;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
