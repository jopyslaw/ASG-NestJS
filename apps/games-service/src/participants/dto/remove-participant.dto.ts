import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveParticipantDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
