import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private authServiceClient: ClientRMQ,
  ) {}

  @Post('signup')
  signUp(@Body() data) {
    return this.authServiceClient.send('createUser', data);
  }

  @Post('signin')
  singIn(@Body() data) {
    return this.authServiceClient.send('signIn', data);
  }
}
