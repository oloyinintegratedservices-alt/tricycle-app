import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma.service';
import { OrderType } from 'generated/prisma/enums';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const existingOrder = await this.prisma.order.findFirst({
      where: {
        tricycleId: createOrderDto.tricycleId,
        userId: createOrderDto.userId,
      },
    });

    if (existingOrder) {
      throw new BadRequestException(
        'Order with existing tricyle and customer has been created',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: createOrderDto.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('Customer has not been added');
    }

    const tricycle = await this.prisma.tricycle.findUnique({
      where: {
        id: createOrderDto.tricycleId,
      },
    });

    if (!tricycle) {
      throw new BadRequestException('Tricycle has not been added');
    }

    const totalPrice = createOrderDto.totalPrice ?? tricycle.salePrice ?? 0;

    if (totalPrice <= 0) {
      throw new BadRequestException('Total price cannot be zero or negative');
    }

    if (createOrderDto.orderType == OrderType.DIRECT_PURCHASE) {
      const order = await this.prisma.order.create({
        data: {
          ...createOrderDto,
          totalPrice,
          orderType: OrderType.DIRECT_PURCHASE,
        },
      });

      return order;
    }

    if (createOrderDto.orderType === 'HIRE_PURCHASE') {
      if (!createOrderDto.startDate)
        throw new BadRequestException('No start date');
      if (createOrderDto.scheduleType === 'WEEKLY' && !createOrderDto.weeks)
        throw new BadRequestException('No weeks');
      if (createOrderDto.scheduleType === 'MONTHLY' && !createOrderDto.months)
        throw new BadRequestException('No months');
    }

    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          totalPrice,
          orderType: OrderType.HIRE_PURCHASE,
          tricycleId: createOrderDto.tricycleId,
          userId: createOrderDto.userId,
          downPayment: createOrderDto.downPayment,
          startDate: new Date(createOrderDto.startDate!),
        },
      });

      const installments =
        createOrderDto.scheduleType == 'WEEKLY'
          ? Math.max(createOrderDto.weeks as number, 1)
          : Math.max(createOrderDto.months as number, 1);

      const amountToPay = Math.floor(totalPrice / installments);

      const isWeekly = createOrderDto.scheduleType === 'WEEKLY';

      let balance = totalPrice;

      let currentStart = new Date(createOrderDto.startDate!);

      let schedules: any = [];

      for (let i = 1; i <= installments; i++) {
        const currentEnd = new Date(currentStart);

        if (isWeekly) currentEnd.setDate(currentEnd.getDate() + 7);
        else currentEnd.setMonth(currentEnd.getMonth() + 1);

        let amountDue = i === installments ? balance : amountToPay;

        balance -= amountDue;

        schedules.push({
          installmentNumber: i,
          startDate: new Date(currentStart),
          dueDate: new Date(currentEnd),
          amountDue,
          orderId: order.id,
        });

        // Move to next week or month
        currentStart = currentEnd;
      }

      await tx.repaymentSchedule.createMany({
        data: schedules,
      });

      return order;
    });
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      where: {
        deleted: false,
      },
      select: {
        id: true,
        orderType: true,
        status: true,
        totalPrice: true,
        downPayment: true,
        tricycle: {
          select: {
            model: true,
            color: true,
            chasisNumber: true,
            engineNumber: true,
          },
        },
        user: {
          select: {
            fullname: true,
          },
        },
      },
    });

    return orders.map(({ tricycle, user, ...order }) => ({
      ...order,
      model: tricycle?.model,
      color: tricycle.color,
      chasisNumber: tricycle.chasisNumber,
      engineNumber: tricycle.engineNumber,
      fullname: user.fullname,
    }));
  }

  findOne(id: string) {
    return this.prisma.order.findFirst({
      where: {
        id,
      },
    });
  }

  getPaymentSchedules(orderId: string) {
    return this.prisma.repaymentSchedule.findMany({
      where: {
        orderId,
      },
    });
  }

  update(updateOrderDto: UpdateOrderDto) {
    // return this.prisma.order.update({
    //   where: {
    //     id: updateOrderDto.id,
    //   },
    //   data: updateOrderDto,
    // });
  }

  softdelete(id: string) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
