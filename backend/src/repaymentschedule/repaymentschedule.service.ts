import { Injectable } from '@nestjs/common';
import { CreateRepaymentscheduleDto } from './dto/create-repaymentschedule.dto';
import { UpdateRepaymentscheduleDto } from './dto/update-repaymentschedule.dto';

@Injectable()
export class RepaymentscheduleService {
  create(createRepaymentscheduleDto: CreateRepaymentscheduleDto) {
    return 'This action adds a new repaymentschedule';
  }

  findAll() {
    return `This action returns all repaymentschedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repaymentschedule`;
  }

  update(id: number, updateRepaymentscheduleDto: UpdateRepaymentscheduleDto) {
    return `This action updates a #${id} repaymentschedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} repaymentschedule`;
  }
}
