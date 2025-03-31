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

@Controller()
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @MessagePattern('createArea')
  //@UsePipes(new ValidationPipe())
  create(@Payload() createAreaDto: CreateAreaDto) {
    const createAreaDtoWithOwnerId = {
      name: createAreaDto.name,
      number_of_fields: createAreaDto.number_of_fields,
      coordinates_of_place: createAreaDto.coordinates_of_place,
      owner_id: createAreaDto.user_id,
    };

    return this.areaService.create(createAreaDtoWithOwnerId);
  }

  @MessagePattern('findAllArea')
  findAll() {
    return this.areaService.findAll();
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
  remove(@Payload() id: number) {
    return this.areaService.remove(id);
  }
}
