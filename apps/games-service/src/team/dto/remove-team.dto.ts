import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveTeamDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
