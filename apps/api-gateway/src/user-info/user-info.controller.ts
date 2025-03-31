import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt-guard/jwt-guard.guard';

@Controller('user-info')
export class UserInfoController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.USERS_SERVICE)
    private usersServiceClient: ClientRMQ,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-user-info')
  createUserInfo(@Body() userData, @Req() req) {
    const userDataWithUserId = { ...userData, userId: req.user.sub };
    return this.usersServiceClient.send('createUser', userDataWithUserId);
  }
}
