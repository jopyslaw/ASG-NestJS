import { CreateFieldInfoDto } from './create-field-info.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateFieldInfoDto extends OmitType(
  PartialType(CreateFieldInfoDto),
  ['area_id'] as const,
) {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;
}
