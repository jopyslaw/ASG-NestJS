import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveAreaInfoDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
