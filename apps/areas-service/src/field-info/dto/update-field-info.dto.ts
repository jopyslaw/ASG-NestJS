import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateFieldInfoDto } from './create-field-info.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFieldInfoDto extends OmitType(
  PartialType(CreateFieldInfoDto),
  ['area_id'] as const,
) {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
