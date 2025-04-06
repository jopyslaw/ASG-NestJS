import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveAllGamesDto {
  @IsNotEmpty()
  @IsArray()
  field_ids: number[];

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
