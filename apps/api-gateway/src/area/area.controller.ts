import {
  Body,
  Controller,
  Delete,
  Inject,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';
import { CreateAreaDto } from './dto/create-area.dto';
import { RemoveAreaDto } from './dto/remove-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('area')
export class AreaController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private areaServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-area')
  createArea(@Body() createAreaData: CreateAreaDto, @Req() req) {
    const createAreaDataWithUser = { ...createAreaData, user_id: req.user.sub };
    return this.areaServiceClient.send('createArea', createAreaDataWithUser);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-area')
  deleteArea(@Body() removeAreaData: RemoveAreaDto, @Req() req) {
    const removeAreaDataWithUser = { ...removeAreaData, user_id: req.user.sub };
    return this.areaServiceClient.send('removeArea', removeAreaDataWithUser);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-area')
  updateArea(@Body() updateAreaData: UpdateAreaDto, @Req() req) {
    const updateAreaDataWithUser = { ...updateAreaData, user_id: req.user.sub };
    return this.areaServiceClient.send('updateArea', updateAreaDataWithUser);
  }
}
