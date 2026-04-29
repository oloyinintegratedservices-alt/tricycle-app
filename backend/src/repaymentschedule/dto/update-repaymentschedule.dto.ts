import { PartialType } from '@nestjs/mapped-types';
import { CreateRepaymentscheduleDto } from './create-repaymentschedule.dto';

export class UpdateRepaymentscheduleDto extends PartialType(CreateRepaymentscheduleDto) {}
