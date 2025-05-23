import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FieldInfoService } from './field-info.service';
import { CreateFieldInfoDto } from './dto/create-field-info.dto';
import { UpdateFieldInfoDto } from './dto/update-field-info.dto';
import { RemoveFieldInfoDto } from './dto/remove-field-info.dto';

@Controller()
export class FieldInfoController {
  constructor(private readonly fieldInfoService: FieldInfoService) {}

  @MessagePattern('createFieldInfo')
  create(@Payload() createFieldInfoDto: CreateFieldInfoDto) {
    return this.fieldInfoService.create(createFieldInfoDto);
  }

  @MessagePattern('findAllFieldInfo')
  findAll() {
    return this.fieldInfoService.findAll();
  }

  @MessagePattern('findAllFieldsForAreaId')
  findAllFieldsForAreaId(areaId: number) {
    return this.fieldInfoService.findAllFieldsForAreaId(areaId);
  }

  @MessagePattern('findOneFieldInfo')
  findOne(@Payload() id: number) {
    return this.fieldInfoService.findOne(id);
  }

  @MessagePattern('updateFieldInfo')
  update(@Payload() updateFieldInfoDto: UpdateFieldInfoDto) {
    return this.fieldInfoService.update(
      updateFieldInfoDto.id,
      updateFieldInfoDto,
    );
  }

  @MessagePattern('removeFieldInfo')
  remove(@Payload() removeFieldInfoDto: RemoveFieldInfoDto) {
    return this.fieldInfoService.remove(removeFieldInfoDto);
  }
}
