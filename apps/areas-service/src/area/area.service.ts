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
    const areaDtoData = {
      name: createAreaDto.name,
      number_of_fields: createAreaDto.number_of_fields,
      owner_id: createAreaDto.user_id,
      coordinates_of_place: createAreaDto.coordinates_of_place,
    };

    const area = this.areaRepository.create(areaDtoData);
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

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.findOne(id).catch((error) => {
      if (error) {
        console.log('Error occured:', error.message);
      }
    });

    return await this.areaRepository.update(id, updateAreaDto);
  }

  async remove(id: number) {
    const area = await this.findOne(id);

    return await this.areaRepository.remove([area]);
  }
}
