import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'reset-password-jwt',
  (): JwtSignOptions => ({
    secret: process.env.JWT_RESET_PASSWORD_SECRET,
    expiresIn: process.env.JWT_RESET_PASSWORD_EXPIRES_IN || '7d',
  }),
);
