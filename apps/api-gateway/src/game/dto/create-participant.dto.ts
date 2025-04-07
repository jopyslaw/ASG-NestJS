import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateParticipantDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  team_id: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  user_id: number;
}
