import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaInfoDto } from './dto/create-area-info.dto';
import { UpdateAreaInfoDto } from './dto/update-area-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaInfo } from 'src/entities/area-info.entity';
import { Repository } from 'typeorm';
import { AreaService } from 'src/area/area.service';
import { RemoveAreaInfoDto } from './dto/remove-area-info.dto';
import { DateTime } from 'luxon';

@Injectable()
export class AreaInfoService {
  constructor(
    @InjectRepository(AreaInfo)
    private areaInfoRepository: Repository<AreaInfo>,
    private areaService: AreaService,
  ) {}

  async create(createAreaInfoDto: CreateAreaInfoDto) {
    const area = await this.areaService.findOne(createAreaInfoDto.area_id);

    if (area.owner_id !== createAreaInfoDto.user_id) {
      throw new ForbiddenException();
    }

    const createAreaInfoDtoWithArea = { ...createAreaInfoDto, area: area };

    const areaInfo = this.areaInfoRepository.create(createAreaInfoDtoWithArea);

    return await this.areaInfoRepository.save(areaInfo);
  }

  async findAll() {
    return await this.areaInfoRepository.find({});
  }

  async findAreaInfoForAreaId(areaId: number) {
    return await this.areaInfoRepository.find({
      where: {
        area: {
          id: areaId,
        },
      },
    });
  }

  async findOne(id: number) {
    const areaInfo = await this.areaInfoRepository.findOne({
      where: {
        id,
      },
      relations: ['area'],
    });

    if (!areaInfo) {
      throw new NotFoundException();
    }

    return areaInfo;
  }

  async update(id: number, updateAreaInfoDto: UpdateAreaInfoDto) {
    const areaInfo = await this.findOne(id);

    const { user_id, ...updateAreaInfoDtoWithoutUser } = updateAreaInfoDto;

    if (areaInfo.area.owner_id !== user_id) {
      throw new ForbiddenException();
    }

    return await this.areaInfoRepository.update(
      {
        id,
      },
      {
        ...updateAreaInfoDtoWithoutUser,
        updated_by: user_id,
        last_updated_at: DateTime.now().toISODate(),
      },
    );
  }

  async remove(removeAreaInfoDto: RemoveAreaInfoDto) {
    const areaInfo = await this.findOne(removeAreaInfoDto.id);

    if (areaInfo.area.owner_id !== removeAreaInfoDto.user_id) {
      throw new ForbiddenException();
    }

    return await this.areaInfoRepository.remove([areaInfo]);
  }
}
