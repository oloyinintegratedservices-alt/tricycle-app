import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RepaymentscheduleService } from './repaymentschedule.service';
import { CreateRepaymentscheduleDto } from './dto/create-repaymentschedule.dto';
import { UpdateRepaymentscheduleDto } from './dto/update-repaymentschedule.dto';

@Controller('repaymentschedule')
export class RepaymentscheduleController {
  constructor(private readonly repaymentscheduleService: RepaymentscheduleService) {}

  @Post()
  create(@Body() createRepaymentscheduleDto: CreateRepaymentscheduleDto) {
    return this.repaymentscheduleService.create(createRepaymentscheduleDto);
  }

  @Get()
  findAll() {
    return this.repaymentscheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.repaymentscheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRepaymentscheduleDto: UpdateRepaymentscheduleDto) {
    return this.repaymentscheduleService.update(+id, updateRepaymentscheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.repaymentscheduleService.remove(+id);
  }
}
