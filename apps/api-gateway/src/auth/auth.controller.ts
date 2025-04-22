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
    return this.authServiceClient.send('createUser', data);
  }

  @Post('sign-out')
  signOut() {
    return this.authServiceClient.send('sigOut', {});
  }

  @Post('refresh-token')
  refreshToken() {
    return this.authServiceClient.send('refreshToken', {});
  }

  @Post('signin')
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authServiceClient.send('signIn', loginUserDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authServiceClient.send('forgotPassword', forgotPasswordDto);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authServiceClient.send('resetPassword', resetPasswordDto);
  }
}
