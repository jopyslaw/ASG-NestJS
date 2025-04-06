import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';

@Controller('area-info')
export class AreaInfoController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private areaInfoServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-area-info')
  createArea(@Body() areaInfoData, @Req() req) {
    const areaInfoDataWithUser = { ...areaInfoData, user_id: req.user.sub };
    return this.areaInfoServiceClient.send(
      'createAreaInfo',
      areaInfoDataWithUser,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-area-info')
  removeArea(@Body() removeAreaInfoData, @Req() req) {
    const removeAreaInfoDataWithUser = {
      ...removeAreaInfoData,
      user_id: req.user.sub,
    };
    return this.areaInfoServiceClient.send(
      'removeAreaInfo',
      removeAreaInfoDataWithUser,
    );
  }
}
