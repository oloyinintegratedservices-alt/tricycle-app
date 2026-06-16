import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from './dto/create-investment.dto';
import { UpdateInvestmentDto } from './dto/update-investment.dto';
import { PrismaService } from '../prisma.service';
import { CreatePayoutDto } from './dto/create-payout.dto';

@Injectable()
export class InvestmentService {
  constructor(private prisma: PrismaService) {}

  async create(createInvestmentDto: CreateInvestmentDto) {
    const existingInvestment = await this.prisma.investment.findFirst({
      where: {
        tricycleId: createInvestmentDto.tricycleId,
        userId: createInvestmentDto.userId,
      },
    });

    if (existingInvestment) {
      throw new BadRequestException(
        'Investment with existing tricyle and customer has been created',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: createInvestmentDto.userId,
      },
    });

    if (!user) {
      throw new BadRequestException('Customer has not been added');
    }

    const tricycle = await this.prisma.tricycle.findUnique({
      where: {
        id: createInvestmentDto.tricycleId,
      },
    });

    if (!tricycle) {
      throw new BadRequestException('Tricycle has not been added');
    }

    const expectedReturn = createInvestmentDto.expectedReturn;

    if (expectedReturn <= 0) {
      throw new BadRequestException('Total price cannot be zero or negative');
    }

    if (!createInvestmentDto.startDate)
      throw new BadRequestException('No start date');
    if (
      createInvestmentDto.scheduleType === 'WEEKLY' &&
      !createInvestmentDto.weeks
    )
      throw new BadRequestException('No weeks');
    if (
      createInvestmentDto.scheduleType === 'MONTHLY' &&
      !createInvestmentDto.months
    )
      throw new BadRequestException('No months');

    return await this.prisma.investment.create({
      data: {
        investedAmount: createInvestmentDto.investedAmount,
        expectedReturn: createInvestmentDto.expectedReturn,
        tricycleId: createInvestmentDto.tricycleId,
        userId: createInvestmentDto.userId,
        startDate: new Date(createInvestmentDto.startDate!),
      },
    });
  }

  async findAll() {
    const investments = await this.prisma.investment.findMany({
      where: {
        deleted: false,
      },
      select: {
        id: true,
        status: true,
        expectedReturn: true,
        investedAmount: true,
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

    return investments.map(({ tricycle, user, ...investment }) => ({
      ...investment,
      model: tricycle?.model,
      color: tricycle.color,
      chasisNumber: tricycle.chasisNumber,
      engineNumber: tricycle.engineNumber,
      fullname: user.fullname,
    }));
  }

  findOne(id: string) {
    return this.prisma.investment.findFirst({
      where: {
        id,
      },
    });
  }

  getPayoutSchedules(investmentId: string) {
    return this.prisma.payoutSchedule.findMany({
      where: {
        investmentId,
      },
      orderBy: {
        installmentNumber: 'asc',
      },
    });
  }

  update(updateInvestmentDto: UpdateInvestmentDto) {
    // return this.prisma.order.update({
    //   where: {
    //     id: updateInvestmentDto.id,
    //   },
    //   data: updateInvestmentDto,
    // });
  }

  softdelete(id: string) {
    return this.prisma.investment.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.investment.delete({
      where: {
        id,
      },
    });
  }

  async saveInvestmentPayoutForAPayoutSchedule(payoutDto: CreatePayoutDto) {
    if (payoutDto.status) {
      await this.prisma.payoutSchedule.update({
        where: {
          id: payoutDto.payoutScheduleId,
        },
        data: {
          status: payoutDto.status,
        },
      });
    }

    return this.prisma.payout.create({
      data: {
        investmentId: payoutDto.investmentId,
        payoutScheduleId: payoutDto.payoutScheduleId,
        amount: payoutDto.amount,
        payoutDate: payoutDto.payoutDate,
        method: payoutDto.method,
      },
    });
  }

  async saveInvestmentPayout(payoutDto: CreatePayoutDto) {
    return this.prisma.payout.create({
      data: {
        investmentId: payoutDto.investmentId,
        amount: payoutDto.amount,
        payoutDate: payoutDto.payoutDate,
        method: payoutDto.method,
      },
    });
  }

  getInvestmentPayoutsForAPayoutSchedule(payoutScheduleId: string) {
    return this.prisma.payout.findMany({
      where: {
        payoutScheduleId,
      },
      include: {
        payoutSchedule: {
          select: {
            installmentNumber: true,
          },
        },
      },
      orderBy: {
        payoutDate: 'desc',
      },
    });
  }

  getInvestmentPayouts(investmentId: string) {
    return this.prisma.payout.findMany({
      where: {
        investmentId,
      },
      orderBy: {
        payoutDate: 'desc',
      },
    });
  }
}
