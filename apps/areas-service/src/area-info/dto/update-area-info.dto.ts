import { PartialType } from '@nestjs/mapped-types';
import { CreateAreaInfoDto } from './create-area-info.dto';

export class UpdateAreaInfoDto extends PartialType(CreateAreaInfoDto) {
  id: number;
  user_id: number;
}
