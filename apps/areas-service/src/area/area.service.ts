import { RemoveAreaDto } from './dto/remove-area.dto';
import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Area } from 'src/entities/area.entity';
import { Repository } from 'typeorm';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { DateTime } from 'luxon';

@Injectable()
export class AreaService {
  constructor(
    @InjectRepository(Area) private areaRepository: Repository<Area>,
    @Inject(MICROSERVICES_CLIENTS.GAMES_SERVICE)
    private gameServiceClient: ClientRMQ,
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

  async findOneWithFieldInfoRelations(id: number) {
    const area = await this.areaRepository.findOne({
      where: {
        id,
      },
      relations: ['field_info', 'area_info'],
    });

    if (!area) {
      throw new NotFoundException();
    }

    return area;
  }

  async update(id: number, updateAreaDto: UpdateAreaDto) {
    console.log(updateAreaDto);
    if (!this.checkIfAreaOwner(updateAreaDto.user_id, id)) {
      throw new ForbiddenException();
    }

    const area = await this.findOne(id);

    const { user_id, ...updateAreaDtoWithoutUser } = updateAreaDto;

    console.log(user_id);

    return await this.areaRepository.update(
      {
        id,
      },
      {
        ...updateAreaDtoWithoutUser,
        last_update_date: DateTime.now().toISODate(),
        updated_by: user_id,
      },
    );
  }

  async remove(removeAreaDto: RemoveAreaDto) {
    if (!this.checkIfAreaOwner(removeAreaDto.user_id, removeAreaDto.id)) {
      throw new ForbiddenException();
    }

    const area = await this.findOneWithFieldInfoRelations(removeAreaDto.id);

    if (!area) {
      throw new NotFoundException();
    }

    const removeAllGamesDto = {
      user_id: removeAreaDto.user_id,
      field_ids: area.field_info.map((field) => field.id),
    };

    const removedArea = await firstValueFrom(
      this.gameServiceClient.send('removeAllGames', removeAllGamesDto),
    ).catch((error) => {
      if (error.error.statusCode !== 404) {
        console.log(error);
      }
    });

    return await this.areaRepository.remove([area]);
  }

  async checkIfAreaOwner(userId: number, areaId: number) {
    console.log(userId, areaId);

    const area = await this.areaRepository.findOne({
      where: {
        id: areaId,
        owner_id: userId,
      },
    });

    console.log(area);

    if (!area) {
      throw new NotFoundException();
    }

    return area.owner_id === userId;
  }
}
