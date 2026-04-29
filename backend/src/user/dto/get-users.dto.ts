import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;
}
