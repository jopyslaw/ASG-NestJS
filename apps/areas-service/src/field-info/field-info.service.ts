import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFieldInfoDto } from './dto/create-field-info.dto';
import { UpdateFieldInfoDto } from './dto/update-field-info.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldInfo } from 'src/entities/field-info.entity';
import { Repository } from 'typeorm';
import { AreaService } from 'src/area/area.service';
import { Area } from 'src/entities/area.entity';

@Injectable()
export class FieldInfoService {
  constructor(
    @InjectRepository(FieldInfo)
    private fieldInfoRepository: Repository<FieldInfo>,
    private areaService: AreaService,
  ) {}

  async create(createFieldInfoDto: CreateFieldInfoDto) {
    const area = await this.areaService.findOne(createFieldInfoDto.area_id);

    if (area.owner_id !== createFieldInfoDto.user_id) {
      throw new ForbiddenException();
    }

    const fields = await this.findAllFieldsForArea(area);

    if (fields.length > area.number_of_fields) {
      throw new BadRequestException("You can't add more fields");
    }

    const createFieldInfoDtoData = {
      description: createFieldInfoDto.description,
      max_players_number: createFieldInfoDto.max_players_number,
      min_players_number: createFieldInfoDto.min_players_number,
      area: area,
      created_by: createFieldInfoDto.user_id,
    };

    const areaFieldInfo = this.fieldInfoRepository.create(
      createFieldInfoDtoData,
    );

    return await this.fieldInfoRepository.save(areaFieldInfo);
  }

  findAll() {
    return `This action returns all fieldInfo`;
  }

  async findOne(id: number) {
    const field = await this.fieldInfoRepository.findOne({
      where: {
        id,
      },
    });

    console.log('FIELD', field);

    if (!field) {
      throw new NotFoundException();
    }

    return field;
  }

  async findAllFieldsForArea(area: Area) {
    const areas = await this.fieldInfoRepository.find({
      where: {
        area: area,
      },
    });

    return areas;
  }

  update(id: number, updateFieldInfoDto: UpdateFieldInfoDto) {
    return `This action updates a #${id} fieldInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} fieldInfo`;
  }
}
