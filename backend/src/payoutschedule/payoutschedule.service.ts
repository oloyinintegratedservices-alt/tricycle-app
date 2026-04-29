import { Injectable } from '@nestjs/common';
import { CreatePayoutscheduleDto } from './dto/create-payoutschedule.dto';
import { UpdatePayoutscheduleDto } from './dto/update-payoutschedule.dto';

@Injectable()
export class PayoutscheduleService {
  create(createPayoutscheduleDto: CreatePayoutscheduleDto) {
    return 'This action adds a new payoutschedule';
  }

  findAll() {
    return `This action returns all payoutschedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payoutschedule`;
  }

  update(id: number, updatePayoutscheduleDto: UpdatePayoutscheduleDto) {
    return `This action updates a #${id} payoutschedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} payoutschedule`;
  }
}
