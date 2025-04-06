import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveGameDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
