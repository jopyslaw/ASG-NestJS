import { firstValueFrom } from 'rxjs';
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(MICROSERVICES_CLIENTS.AUTH_SERVICE)
    private authServiceClient: ClientRMQ,
  ) {}

  @Post('signup')
  async signUp(@Body() data: CreateUserDto) {
    return await firstValueFrom(
      this.authServiceClient.send('createUser', data),
    );
  }

  @Post('signin')
  signIn(@Body() data: LoginUserDto) {
    return this.authServiceClient.send('signIn', data);
  }

  @Post('forgot-password')
  forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authServiceClient.send('forgotPassword', data);
  }

  @Post('reset-password')
  resetPassword(@Body() data: ResetPasswordDto) {
    return this.authServiceClient.send('resetPassword', data);
  }
}
