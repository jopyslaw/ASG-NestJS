import { CreateAreaDto } from './create-area.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateAreaDto extends PartialType(CreateAreaDto) {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  id: number;
}
