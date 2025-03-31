import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class NewUserMailDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
