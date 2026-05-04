import { IsEmail, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  password!: string;

  @IsString()
  token!: string;
}
