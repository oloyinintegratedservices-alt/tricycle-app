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
import { CreatePaymentDto } from './dto/payment.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post('hirepurchase')
  createHirePurchaseOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.createHirePurchaseOrder(createOrderDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post('hirepurchase/payment')
  createHirePurchaseOrderPayment(@Body() paymentDto: CreatePaymentDto) {
    return this.orderService.saveHirePurchaseOrderPaymentForAPaymentSchedule(
      paymentDto,
    );
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get()
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get('schedule/:id/payments')
  getHirePurchaseOrderPaymentsForAPaymentSchedule(@Param('id') id: string) {
    return this.orderService.getHirePurchaseOrderPaymentsForAPaymentSchedule(
      id,
    );
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get('hirepurchase')
  getAllHirePurchaseOrders() {
    return this.orderService.getAllHirePurchaseOrders();
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
  @Patch()
  update(@Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(updateOrderDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
