import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AreaInfoService } from './area-info.service';
import { CreateAreaInfoDto } from './dto/create-area-info.dto';
import { UpdateAreaInfoDto } from './dto/update-area-info.dto';
import { RemoveAreaInfoDto } from './dto/remove-area-info.dto';

@Controller()
export class AreaInfoController {
  constructor(private readonly areaInfoService: AreaInfoService) {}

  @MessagePattern('createAreaInfo')
  create(@Payload() createAreaInfoDto: CreateAreaInfoDto) {
    return this.areaInfoService.create(createAreaInfoDto);
  }

  @MessagePattern('findAllAreaInfo')
  findAll() {
    return this.areaInfoService.findAll();
  }

  @MessagePattern('findAreaInfoForAreaId')
  findAreaInfoForAreaId(areaId: number) {
    return this.areaInfoService.findAreaInfoForAreaId(areaId);
  }

  @MessagePattern('findOneAreaInfo')
  findOne(@Payload() id: number) {
    return this.areaInfoService.findOne(id);
  }

  @MessagePattern('updateAreaInfo')
  update(@Payload() updateAreaInfoDto: UpdateAreaInfoDto) {
    return this.areaInfoService.update(updateAreaInfoDto.id, updateAreaInfoDto);
  }

  @MessagePattern('removeAreaInfo')
  remove(@Payload() removeAreaInfoDto: RemoveAreaInfoDto) {
    return this.areaInfoService.remove(removeAreaInfoDto);
  }
}
