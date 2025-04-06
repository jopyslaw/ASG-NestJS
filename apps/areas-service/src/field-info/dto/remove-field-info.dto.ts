import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveFieldInfoDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
