import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateAreaInfoDto } from './dto/create-area-info.dto';
import { UpdateAreaInfoDto } from './dto/update-area-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaInfo } from 'src/entities/area-info.entity';
import { Repository } from 'typeorm';
import { AreaService } from 'src/area/area.service';

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

    const createAreaInfoDtoWithArea = { ...createAreaInfoDto, area_id: area };

    const areaInfo = this.areaInfoRepository.create(createAreaInfoDtoWithArea);

    return await this.areaInfoRepository.save(areaInfo);
  }

  findAll() {
    return `This action returns all areaInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} areaInfo`;
  }

  update(id: number, updateAreaInfoDto: UpdateAreaInfoDto) {
    return `This action updates a #${id} areaInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} areaInfo`;
  }
}
