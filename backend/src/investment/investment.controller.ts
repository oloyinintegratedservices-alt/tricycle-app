import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';

@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Post()
  create(@Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentService.create(createInvestmentDto);
  }

  @Get()
  findAll() {
    return this.investmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentService.findOne(id);
  }

  @Get(':id/payoutschedules')
  getRepayoutschedules(@Param('id') id: string) {
    return this.investmentService.getPayoutSchedules(id);
  }

  @Patch(':id')
  update(@Body() updateInvestmentDto: UpdateInvestmentDto) {
    return this.investmentService.update(updateInvestmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investmentService.remove(id);
  }
}
