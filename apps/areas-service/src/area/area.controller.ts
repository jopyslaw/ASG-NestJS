import { Controller, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { RemoveAreaDto } from './dto/remove-area.dto';

@Controller()
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @MessagePattern('createArea')
  create(@Payload() createAreaDto: CreateAreaDto) {
    return this.areaService.create(createAreaDto);
  }

  @MessagePattern('findAllArea')
  findAll() {
    return this.areaService.findAll();
  }

  @MessagePattern('findAllAreasOwnedByUser')
  findAllAreasOwnedByUser(userId: number) {
    return this.areaService.findAllAreasOwnedByUser(userId);
  }

  @MessagePattern('findOneArea')
  findOne(@Payload() id: number) {
    return this.areaService.findOne(id);
  }

  @MessagePattern('updateArea')
  update(@Payload() updateAreaDto: UpdateAreaDto) {
    return this.areaService.update(updateAreaDto.id, updateAreaDto);
  }

  @MessagePattern('removeArea')
  remove(@Payload() removeAreaDto: RemoveAreaDto) {
    return this.areaService.remove(removeAreaDto);
  }
}
