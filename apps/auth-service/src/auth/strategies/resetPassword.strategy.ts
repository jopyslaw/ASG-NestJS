import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import jwtResetPasswordConfig from '../config/jwt-reset-password.config';
import { ResetPasswordJwtPayload } from '../types/resetPassword-jwtPayload';

@Injectable()
export class ResetPasswordJwtStrategy extends PassportStrategy(
  Strategy,
  'reset-password-jwt',
) {
  constructor(
    @Inject(jwtResetPasswordConfig.KEY)
    private resetPasswordJwtConfiguration: ConfigType<
      typeof jwtResetPasswordConfig
    >,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      secretOrKey: resetPasswordJwtConfiguration.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: ResetPasswordJwtPayload) {
    const forgotPasswordToken = req.body.token;
    const email = payload.sub;

    return await this.authService.validateResetPasswordToken(
      email,
      forgotPasswordToken,
    );
  }
}
