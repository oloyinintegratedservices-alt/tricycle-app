import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsEnum,
  ValidateIf,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod, PayoutStatus } from 'generated/prisma/enums';

export class CreatePayoutDto {
  @IsString()
  investmentId!: string;

  @IsOptional()
  @IsString()
  recordedBy?: string;

  @IsOptional()
  @IsEnum(PayoutStatus)
  status?: PayoutStatus;

  @IsOptional()
  @IsString()
  payoutScheduleId?: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsNumber()
  amount!: number;

  @Type(() => Date)
  @IsDate()
  payoutDate!: Date;
}
