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
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from 'generated/prisma/enums';

@UseGuards(JwtGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get(':id/repaymentschedules')
  getRepaymentschedules(@Param('id') id: string) {
    return this.orderService.getPaymentSchedules(id);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Patch(':id')
  update(@Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(updateOrderDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
