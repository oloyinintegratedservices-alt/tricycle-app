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
import { PaymentMethod, RepaymentStatus } from 'generated/prisma/enums';

export class CreatePaymentDto {
  @IsString()
  orderId!: string;

  @IsOptional()
  @IsString()
  recordedBy?: string;

  @IsOptional()
  @IsEnum(RepaymentStatus)
  status?: RepaymentStatus;

  @IsOptional()
  @IsString()
  paymentScheduleId?: string;

  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @IsNumber()
  amount!: number;

  @Type(() => Date)
  @IsDate()
  paymentDate!: Date;
}
