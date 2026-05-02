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
import { DashboardService } from './dashboard.service';
import { JwtGuard } from '../common/guards/jwt.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from 'generated/prisma/enums';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.admin, RoleName.super_admin)
  @Get('admin')
  getAllStats() {
    return this.dashboardService.getAllStats();
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.user)
  @Get('user')
  getUserStats(@GetUser() user: any) {
    return this.dashboardService.getUserStats(user.userId);
  }
}
