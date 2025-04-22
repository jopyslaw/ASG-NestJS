import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';
import { CreateFieldInfoDto } from './dto/create-field-info.dto';
import { RemoveFieldInfoDto } from './dto/remove-field-info.dto';
import { UpdateFieldInfoDto } from './dto/update-field-info.dto';

@Controller('field-info')
export class FieldInfoController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private fieldInfoServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-field-info')
  createFieldAreaInfo(
    @Body() createFieldInfoData: CreateFieldInfoDto,
    @Req() req: any,
  ) {
    const createFieldInfoDataWithUser = {
      ...createFieldInfoData,
      user_id: req.user.sub,
    };
    return this.fieldInfoServiceClient.send(
      'createFieldInfo',
      createFieldInfoDataWithUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-field-info')
  removeFieldAreaInfo(
    @Body() removeFieldInfoData: RemoveFieldInfoDto,
    @Req() req: any,
  ) {
    const removeFieldInfoDataWithUser = {
      ...removeFieldInfoData,
      user_id: req.user.sub,
    };
    return this.fieldInfoServiceClient.send(
      'removeFieldInfo',
      removeFieldInfoDataWithUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-field-info')
  updateFieldAreaInfo(
    @Body() updateFieldInfoData: UpdateFieldInfoDto,
    @Req() req: any,
  ) {
    const updateFieldInfoDataWithUser = {
      ...updateFieldInfoData,
      user_id: req.user.sub,
    };
    return this.fieldInfoServiceClient.send(
      'updateFieldInfo',
      updateFieldInfoDataWithUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-all-field-info')
  findAllFieldInfo() {
    return this.fieldInfoServiceClient.send('findAllFieldInfo', {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-all-field-info-for-area-id')
  findAllFieldsForAreaId(@Query('areaId') areaId: number) {
    return this.fieldInfoServiceClient.send('findAllFieldsForAreaId', areaId);
  }
}
