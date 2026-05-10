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
import { TricycleService } from './tricycle.service';
import { CreateTricycleDto } from './dto/create-tricycle.dto';
import { UpdateTricycleDto } from './dto/update-tricycle.dto';
import { JwtGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../../generated/prisma/enums';

@UseGuards(JwtGuard, RolesGuard)
@Controller('tricycle')
export class TricycleController {
  constructor(private readonly tricycleService: TricycleService) {}

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post()
  create(@Body() createTricycleDto: CreateTricycleDto) {
    return this.tricycleService.create(createTricycleDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get()
  findAll() {
    return this.tricycleService.findAll();
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tricycleService.findOne(id);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Patch()
  update(@Body() updateTricycleDto: UpdateTricycleDto) {
    return this.tricycleService.update(updateTricycleDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tricycleService.softdelete(id);
  }
}
