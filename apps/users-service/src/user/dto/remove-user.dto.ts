import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveUserDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
