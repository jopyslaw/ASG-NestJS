import { PartialType } from '@nestjs/mapped-types';
import { CreateFieldInfoDto } from './create-field-info.dto';

export class UpdateFieldInfoDto extends PartialType(CreateFieldInfoDto) {
  id: number;
  user_id: number;
}
