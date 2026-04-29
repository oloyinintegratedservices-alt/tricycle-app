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
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtGuard)
  @Get('admin')
  getAllStats() {
    return this.dashboardService.getAllStats();
  }

  @UseGuards(JwtGuard)
  @Get('user')
  getUserStats(@GetUser() user: any) {
    return this.dashboardService.getUserStats(user.userId);
  }
}
