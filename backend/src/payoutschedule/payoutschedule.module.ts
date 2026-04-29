import { Module } from '@nestjs/common';
import { PayoutscheduleService } from './payoutschedule.service';
import { PayoutscheduleController } from './payoutschedule.controller';

@Module({
  controllers: [PayoutscheduleController],
  providers: [PayoutscheduleService],
})
export class PayoutscheduleModule {}
