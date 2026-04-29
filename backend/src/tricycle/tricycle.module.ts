import { Module } from '@nestjs/common';
import { TricycleService } from './tricycle.service';
import { TricycleController } from './tricycle.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TricycleController],
  providers: [TricycleService, PrismaService],
})
export class TricycleModule {}
