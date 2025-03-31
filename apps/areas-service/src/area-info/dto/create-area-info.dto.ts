import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateAreaInfoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string;

  @IsNotEmpty()
  @IsNumber()
  area_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
