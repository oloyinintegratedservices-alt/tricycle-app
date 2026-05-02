import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RoleName } from 'generated/prisma/enums';
import { OrderStatus } from 'generated/prisma/enums';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAllStats() {
    const now = new Date();

    const startDate = new Date();
    startDate.setDate(now.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      totalInvestments,
      totalTricycles,
      totalCustomers,
      revenueAggregate,
      customersPerDay,
      ordersPerDay,
      recentOrders,
    ] = await this.prisma.$transaction([
      this.prisma.order.count(),

      this.prisma.investment.count(),

      this.prisma.tricycle.count({
        where: {
          deleted: false,
        },
      }),

      this.prisma.user.count({
        where: {
          userRoles: {
            some: {
              role: {
                name: RoleName.user,
              },
            },
          },
        },
      }),

      this.prisma.order.aggregate({
        where: {
          status: OrderStatus.ACTIVE,
        },
        _sum: {
          totalPrice: true,
        },
      }),

      // Customers per day
      this.prisma.$queryRaw<{ date: Date; count: number }[]>`
  SELECT
    d::date AS date,
    COALESCE(COUNT(u.id), 0)::int AS count
  FROM generate_series(
    ${startDate}::date,
    NOW()::date,
    INTERVAL '1 day'
  ) d
  LEFT JOIN "User" u
    ON u."createdAt" >= d
    AND u."createdAt" < d + INTERVAL '1 day'
  LEFT JOIN "UserRole" ur
    ON ur."userId" = u.id
  LEFT JOIN "Role" r
    ON r.id = ur."roleId"
    AND r.name = 'user'
  GROUP BY d
  ORDER BY d ASC
`,

      this.prisma.$queryRaw<{ date: Date; count: number }[]>`
  SELECT
    d::date AS date,
    COALESCE(COUNT(o.id), 0)::int AS count
  FROM generate_series(
    ${startDate}::date,
    NOW()::date,
    INTERVAL '1 day'
  ) d
  LEFT JOIN "Order" o
    ON o."createdAt" >= d
    AND o."createdAt" < d + INTERVAL '1 day'
  GROUP BY d
  ORDER BY d ASC
`,

      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          orderType: true,
          user: {
            select: {
              id: true,
              email: true,
              fullname: true,
            },
          },
          tricycle: {
            select: {
              chasisNumber: true,
              engineNumber: true,
              model: true,
            },
          },
        },
      }),
    ]);

    return {
      totalOrders,
      totalInvestments,
      totalTricycles,
      totalCustomers,
      totalRevenue: revenueAggregate._sum.totalPrice
        ? Number(revenueAggregate._sum.totalPrice)
        : 0,
      customersPerDay,
      ordersPerDay,
      recentOrders,
    };
  }
  async getUserStats(userId: string) {
    const now = new Date();

    const startDate = new Date();
    startDate.setDate(now.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const [totalOrders, totalInvestments, recentOrders, recentInvestments] =
      await this.prisma.$transaction([
        this.prisma.order.count({
          where: {
            userId,
          },
        }),

        this.prisma.investment.count({
          where: {
            userId,
          },
        }),

        // this.prisma.order.aggregate({
        //   where: {
        //     status: OrderStatus.ACTIVE,
        //   },
        //   _sum: {
        //     totalPrice: true,
        //   },
        // }),

        this.prisma.order.findMany({
          where: {
            userId,
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            orderType: true,
            user: {
              select: {
                id: true,
                email: true,
                fullname: true,
              },
            },
            tricycle: {
              select: {
                chasisNumber: true,
                engineNumber: true,
                model: true,
              },
            },
          },
        }),

        this.prisma.investment.findMany({
          where: {
            userId,
          },
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            status: true,
            expectedReturn: true,
            investedAmount: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                email: true,
                fullname: true,
              },
            },
            tricycle: {
              select: {
                chasisNumber: true,
                engineNumber: true,
                model: true,
              },
            },
          },
        }),
      ]);

    return {
      totalOrders,
      totalInvestments,
      recentOrders,
      recentInvestments,
    };
  }
}
