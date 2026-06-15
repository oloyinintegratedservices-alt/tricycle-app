import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from 'generated/prisma/enums';
import { CreatePayoutDto } from './dto/create-payout.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('investment')
export class InvestmentController {
  constructor(private readonly investmentService: InvestmentService) {}

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post()
  create(@Body() createInvestmentDto: CreateInvestmentDto) {
    return this.investmentService.create(createInvestmentDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get()
  findAll() {
    return this.investmentService.findAll();
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.investmentService.findOne(id);
  }

  @Get(':id/payoutschedules')
  getRepayoutschedules(@Param('id') id: string) {
    return this.investmentService.getPayoutSchedules(id);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post('payout/schedule')
  saveInvestmentPayoutForAPayoutSchedule(@Body() payoutDto: CreatePayoutDto) {
    return this.investmentService.saveInvestmentPayoutForAPayoutSchedule(
      payoutDto,
    );
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post('payout')
  saveInvestmentPayout(@Body() payoutDto: CreatePayoutDto) {
    return this.investmentService.saveInvestmentPayout(payoutDto);
  }

  @Get('schedule/:id/payouts')
  getInvestmentPayoutsForAPayoutSchedule(@Param('id') id: string) {
    return this.investmentService.getInvestmentPayoutsForAPayoutSchedule(id);
  }

  @Get(':id/payouts')
  getInvestmentPayouts(@Param('id') id: string) {
    return this.investmentService.getInvestmentPayouts(id);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Patch(':id')
  update(@Body() updateInvestmentDto: UpdateInvestmentDto) {
    return this.investmentService.update(updateInvestmentDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.investmentService.remove(id);
  }
}
