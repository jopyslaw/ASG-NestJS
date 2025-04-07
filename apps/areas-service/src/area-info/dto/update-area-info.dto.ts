import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateAreaInfoDto } from './create-area-info.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAreaInfoDto extends OmitType(
  PartialType(CreateAreaInfoDto),
  ['area_id'] as const,
) {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
