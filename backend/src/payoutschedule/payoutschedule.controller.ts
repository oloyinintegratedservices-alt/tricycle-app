import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PayoutscheduleService } from './payoutschedule.service';
import { CreatePayoutscheduleDto } from './dto/create-payoutschedule.dto';
import { UpdatePayoutscheduleDto } from './dto/update-payoutschedule.dto';

@Controller('payoutschedule')
export class PayoutscheduleController {
  constructor(private readonly payoutscheduleService: PayoutscheduleService) {}

  @Post()
  create(@Body() createPayoutscheduleDto: CreatePayoutscheduleDto) {
    return this.payoutscheduleService.create(createPayoutscheduleDto);
  }

  @Get()
  findAll() {
    return this.payoutscheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payoutscheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePayoutscheduleDto: UpdatePayoutscheduleDto) {
    return this.payoutscheduleService.update(+id, updatePayoutscheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payoutscheduleService.remove(+id);
  }
}
