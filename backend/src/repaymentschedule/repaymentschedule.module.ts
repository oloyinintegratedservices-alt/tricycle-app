import { Module } from '@nestjs/common';
import { RepaymentscheduleService } from './repaymentschedule.service';
import { RepaymentscheduleController } from './repaymentschedule.controller';

@Module({
  controllers: [RepaymentscheduleController],
  providers: [RepaymentscheduleService],
})
export class RepaymentscheduleModule {}
