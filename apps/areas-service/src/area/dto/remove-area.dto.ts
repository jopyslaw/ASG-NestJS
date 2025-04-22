import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveAreaDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
