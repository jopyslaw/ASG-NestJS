import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';

@Controller('field-info')
export class FieldInfoController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AREAS_SERVICE)
    private fieldInfoServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-field-info')
  createFieldAreaInfo(@Body() fieldInfoData: any, @Req() req: any) {
    const fieldInfoDataWithUser = { ...fieldInfoData, user_id: req.user.sub };
    return this.fieldInfoServiceClient.send(
      'createFieldInfo',
      fieldInfoDataWithUser,
    );
  }
}
