import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsString()
  @MinLength(3)
  name?: string;

  @IsString()
  @MinLength(3)
  surname?: string;

  @IsString()
  @IsEmail()
  email: string;
}
