import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [],
  providers: [PrismaService, DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
