import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordAuthGuard } from './guards/reset-password-auth/reset-password-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @MessagePattern('signIn')
  @UseGuards(LocalAuthGuard)
  async login(@Payload() req) {
    return this.authService.login(req.user.id);
  }

  @UseGuards(RefreshAuthGuard)
  @MessagePattern('refreshToken')
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('signOut')
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }

  @MessagePattern('forgotPassword')
  forgotPassword(@Payload() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @UseGuards(ResetPasswordAuthGuard)
  @MessagePattern('resetPassword')
  resetPassword(@Payload() req) {
    const userEmail = req.user.email;
    const password = req.password;

    const resetPasswordDto: ResetPasswordDto = {
      password: password,
      email: userEmail,
    };

    return this.authService.resetPassword(resetPasswordDto);
  }
}
