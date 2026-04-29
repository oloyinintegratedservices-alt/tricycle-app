import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTricycleDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  chasisNumber: string;

  @IsOptional()
  @IsString()
  sku: string;

  @IsString()
  model: string;

  @IsString()
  engineNumber: string;

  @IsOptional()
  @IsNumber()
  purchasePrice: number;

  @IsOptional()
  @IsNumber()
  salePrice: number;

  @IsString()
  color: string;
}
