import { Injectable, BadRequestException, UseGuards } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { RoleName } from 'generated/prisma/enums';
import { CreateStaffDto } from './dto/create-staff.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
// import { ImportStudentInput } from './dto/create-student.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (userExists)
      throw new BadRequestException('User details already exists');

    const hashedPassword = await argon2.hash(
      dto.password ?? process.env.SUPER_ADMIN_PASSWORD!,
    );

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    const userRole = await this.prisma.role.findUnique({
      where: { name: RoleName.user },
    });

    await this.prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: userRole!.id,
      },
    });

    return {
      message: 'User created successfully',
    };
  }

  async updateUser(dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id: dto.id,
      },
      data: {
        ...dto,
      },
    });
  }

  async createStaff(dto: CreateStaffDto) {
    const staffExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (staffExists)
      throw new BadRequestException('Staff details already exists');

    const hashedPassword = await argon2.hash(dto.password);

    const staff = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    const staffRole = await this.prisma.role.findUnique({
      where: { name: RoleName.staff },
    });

    await this.prisma.userRole.create({
      data: {
        userId: staff.id,
        roleId: staffRole!.id,
      },
    });
    1;

    return {
      message: 'Staff created successfully',
    };
  }

  async createAdmin(dto: CreateAdminDto) {
    const adminExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (adminExists)
      throw new BadRequestException('Admin details already exists');

    const hashedPassword = await argon2.hash(dto.password);

    const admin = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    const adminRole = await this.prisma.role.findUnique({
      where: { name: RoleName.admin },
    });

    await this.prisma.userRole.create({
      data: {
        userId: admin.id,
        roleId: adminRole!.id,
      },
    });
    1;

    return {
      message: 'Admin created successfully',
    };
  }

  async getStaffs(query: GetUsersDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {
      deleted: false,
    };

    if (search) {
      where.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          ...where,
          userRoles: {
            some: {
              role: {
                name: 'staff',
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },

        select: {
          id: true,
          fullname: true,
          phone: true,
          email: true,
          createdAt: true,
        },
      }),

      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUsers(query: GetUsersDto) {
    const { page = 1, limit = 1000, search } = query;

    const skip = (page - 1) * limit;

    let where: any = {
      deleted: false,
    };

    if (search) {
      where.OR = [
        { fullname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where: {
          ...where,
          userRoles: {
            some: {
              role: {
                name: 'user',
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },

        select: {
          id: true,
          fullname: true,
          email: true,
          phone: true,
          createdAt: true,
        },
      }),

      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: {
        deleted: false,
        userId,
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

  async getUserInvestments(userId: string) {
    const investments = await this.prisma.investment.findMany({
      where: {
        deleted: false,
        userId,
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

  async getUserPayouts(userId: string) {
    return this.prisma.payout.findMany({
      where: {
        investment: {
          userId,
        },
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

  softdelete(id: string) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }

  delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
