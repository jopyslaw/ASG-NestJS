import { IsArray, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class GameStatusMailDto {
  @IsNumber()
  @IsNotEmpty()
  game_id: number;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @IsNotEmpty()
  @IsArray()
  participants_ids: number[];
}
