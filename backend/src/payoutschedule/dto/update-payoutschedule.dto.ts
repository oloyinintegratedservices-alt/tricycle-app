import { PartialType } from '@nestjs/mapped-types';
import { CreatePayoutscheduleDto } from './create-payoutschedule.dto';

export class UpdatePayoutscheduleDto extends PartialType(CreatePayoutscheduleDto) {}
