import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from 'src/entities/area.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area) private areaRepository: Repository<Area>,
  ) {}

  async create(createAreaDto: CreateAreaDto) {
    const areaData = { ...createAreaDto };
    const area = this.areaRepository.create(areaData);
    return await this.areaRepository.save(area);
  }

  findAll() {
    return `This action returns all area`;
  }

  async findOne(id: number) {
    const area = await this.areaRepository.findOne({
      where: {
        id,
      },
    });

    if (!area) {
      throw new NotFoundException();
    }

    return area;
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
