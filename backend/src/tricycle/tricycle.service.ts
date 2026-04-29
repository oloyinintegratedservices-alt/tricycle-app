import { Injectable } from '@nestjs/common';
import { CreateTricycleDto } from './dto/create-tricycle.dto';
import { UpdateTricycleDto } from './dto/update-tricycle.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TricycleService {
  constructor(private prisma: PrismaService) {}

  create(createTricycleDto: CreateTricycleDto) {
    return this.prisma.tricycle.create({
      data: createTricycleDto,
    });
  }

  findAll() {
    return this.prisma.tricycle.findMany({
      where: {
        deleted: false,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.tricycle.findFirst({
      where: {
        id,
      },
    });
  }

  update(updateTricycleDto: UpdateTricycleDto) {
    return this.prisma.tricycle.update({
      where: {
        id: updateTricycleDto.id,
      },
      data: updateTricycleDto,
    });
  }

  softdelete(id: string) {
    return this.prisma.tricycle.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  }

  remove(id: string) {
    return this.prisma.tricycle.delete({
      where: {
        id,
      },
    });
  }
}
