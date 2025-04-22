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
import { CreateAreaInfoDto } from './dto/create-area-info.dto';
import { RemoveAreaInfoDto } from './dto/remove-area-info.dto';
import { UpdateAreaInfoDto } from './dto/update-area-info.dto';

@Controller('area-info')
export class AreaInfoController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private areaInfoServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-area-info')
  createArea(@Body() areaInfoData: CreateAreaInfoDto, @Req() req) {
    const areaInfoDataWithUser = { ...areaInfoData, user_id: req.user.sub };
    return this.areaInfoServiceClient.send(
      'createAreaInfo',
      areaInfoDataWithUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-area-info')
  removeArea(@Body() removeAreaInfoData: RemoveAreaInfoDto, @Req() req) {
    const removeAreaInfoDataWithUser = {
      ...removeAreaInfoData,
      user_id: req.user.sub,
    };
    return this.areaInfoServiceClient.send(
      'removeAreaInfo',
      removeAreaInfoDataWithUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-area-info')
  updateAreaInfo(@Body() updateAreaInfo: UpdateAreaInfoDto, @Req() req) {
    const updateAreaInfoWithUser = {
      ...updateAreaInfo,
      user_id: req.user.sub,
    };

    return this.areaInfoServiceClient.send(
      'updateAreaInfo',
      updateAreaInfoWithUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-all-area-info')
  findAllAreaInfo() {
    return this.areaInfoServiceClient.send('findAllAreaInfo', {});
  }

  @UseGuards(JwtAuthGuard)
  @Get('find-area-info-for-area-id')
  findAreaInfoForAreaId(@Query('areaId') areaId: number) {
    return this.areaInfoServiceClient.send('findAreaInfoForAreaId', areaId);
  }
}
