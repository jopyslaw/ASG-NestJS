import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPassworMailDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
