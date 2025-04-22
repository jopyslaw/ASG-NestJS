import { CreateAreaInfoDto } from './create-area-info.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';

export class UpdateAreaInfoDto extends OmitType(
  PartialType(CreateAreaInfoDto),
  ['area_id'] as const,
) {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;
}
