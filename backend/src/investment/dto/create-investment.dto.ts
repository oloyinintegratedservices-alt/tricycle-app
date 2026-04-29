import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvestmentDto {
  @IsOptional()
  @IsString()
  id: string | undefined;

  @IsString()
  tricycleId!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  totalPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  investedAmount!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  expectedReturn!: number;

  @IsString()
  scheduleType?: 'WEEKLY' | 'MONTHLY';

  @IsNumber()
  weeks?: number;

  @IsNumber()
  months?: number;

  @IsString()
  startDate?: string;

  @IsString()
  userId!: string;
}
