import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {

  @IsNotEmpty() 
  @IsEmail()
  email: string;

  @IsNotEmpty() 
  @MinLength(6)
  password: string;

  @IsNotEmpty() 
  @IsString()
  phonenumber: string;

   @IsNotEmpty() 
  @IsString()
  full_name: string;
}
