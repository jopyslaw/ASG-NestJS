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
import { RemoveFieldInfoDto } from './dto/remove-field-info.dto';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FieldInfoService {
  constructor(
    @InjectRepository(FieldInfo)
    private fieldInfoRepository: Repository<FieldInfo>,
    private areaService: AreaService,
    @Inject(MICROSERVICES_CLIENTS.GAMES_SERVICE)
    private gameServiceClient: ClientRMQ,
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
      relations: ['area'],
    });

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

  async update(id: number, updateFieldInfoDto: UpdateFieldInfoDto) {
    const field = await this.findOne(id);

    if (field.area.owner_id !== updateFieldInfoDto.user_id) {
      throw new ForbiddenException();
    }

    return await this.fieldInfoRepository.update(id, updateFieldInfoDto);
  }

  async remove(removeFieldInfoDto: RemoveFieldInfoDto) {
    const field = await this.findOne(removeFieldInfoDto.id);

    if (field.area.owner_id !== removeFieldInfoDto.user_id) {
      throw new ForbiddenException();
    }

    const removeAllGamesDto = {
      user_id: removeFieldInfoDto.user_id,
      field_ids: [removeFieldInfoDto.id],
    };

    const removedArea = await firstValueFrom(
      this.gameServiceClient.send('removeAllGames', removeAllGamesDto),
    ).catch((error) => {
      console.log(error);
    });

    return await this.fieldInfoRepository.remove([field]);
  }
}
