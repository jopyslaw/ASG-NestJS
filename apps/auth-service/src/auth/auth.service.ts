import { ResetPasswordDto } from './dto/reset-password.dto';
import { firstValueFrom } from 'rxjs';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MICROSERVICES_CLIENTS } from 'src/constants';
import { ClientRMQ, Payload } from '@nestjs/microservices';
import jwtResetPasswordConfig from './config/jwt-reset-password.config';
import { ResetPasswordJwtPayload } from './types/resetPassword-jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
    @Inject(jwtResetPasswordConfig.KEY)
    private resetPasswordTokenConfig: ConfigType<typeof jwtResetPasswordConfig>,
    @Inject(MICROSERVICES_CLIENTS.NOTIFICATION_SERVICE)
    private notificationServiceClient: ClientRMQ,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByLoginOrEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const isPasswordMatch = await argon2.verify(user.password, password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { id: user.id };
  }

  async login(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async generateTokens(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async generateForgotPasswordToken(email: string) {
    const payload: ResetPasswordJwtPayload = { sub: email };

    const forgotPasswordToken = await this.jwtService.signAsync(
      payload,
      this.resetPasswordTokenConfig,
    );

    return forgotPasswordToken;
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const refreshTokenMatches = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { id: userId };
  }

  async validateResetPasswordToken(email: string, forgotPasswordToken: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user || !user.hashedResetPasswordToken) {
      throw new UnauthorizedException('Invalid hashed reset password token');
    }

    const resetPasswordTokenMatches = await argon2.verify(
      user.hashedResetPasswordToken,
      forgotPasswordToken,
    );

    if (!resetPasswordTokenMatches) {
      throw new UnauthorizedException('Invalid reset password token');
    }

    return { email: email };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.userService.findOneByEmail(resetPasswordDto.email);

    const hashedPassword = await argon2.hash(resetPasswordDto.password);

    return await this.userService.updatePassword(user.id, hashedPassword);
  }

  async signOut(userId: number) {
    await this.userService.updateHashRefreshToken(userId, null);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);

    const forgotPasswordToken = await this.generateForgotPasswordToken(
      forgotPasswordDto.email,
    );

    const hashedForgotPasswordToken = await argon2.hash(forgotPasswordToken);

    await this.userService.updateHashForgotPasswordToken(
      user.id,
      hashedForgotPasswordToken,
    );

    const forgotPasswordMailDto = {
      token: forgotPasswordToken,
      email: forgotPasswordDto.email,
    };

    return await firstValueFrom(
      this.notificationServiceClient.send(
        'sendForgotPasswordMail',
        forgotPasswordMailDto,
      ),
    );
  }
}
