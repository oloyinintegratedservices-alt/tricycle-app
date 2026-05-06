import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from 'generated/prisma/enums';

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

  @IsEnum(OrderType)
  orderType!: OrderType;

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

  @ValidateIf((o) => o.type === OrderType.HIRE_PURCHASE)
  @IsString()
  address?: string;

  @ValidateIf((o) => o.type === OrderType.HIRE_PURCHASE)
  @IsString()
  branchChairman?: string;

  @ValidateIf((o) => o.type === OrderType.HIRE_PURCHASE)
  @IsString()
  guarantorName?: string;

  @ValidateIf((o) => o.type === OrderType.HIRE_PURCHASE)
  @IsString()
  fullname?: string;
}
