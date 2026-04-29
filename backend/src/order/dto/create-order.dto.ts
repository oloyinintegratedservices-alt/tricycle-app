import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  downPayment?: number;

  @IsString()
  orderType!: string;

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
