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
// @Roles(RoleName.admin)
@Controller('tricycle')
export class TricycleController {
  constructor(private readonly tricycleService: TricycleService) {}

  @Post()
  create(@Body() createTricycleDto: CreateTricycleDto) {
    return this.tricycleService.create(createTricycleDto);
  }

  @Get()
  findAll() {
    return this.tricycleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tricycleService.findOne(id);
  }

  @Patch()
  update(@Body() updateTricycleDto: UpdateTricycleDto) {
    return this.tricycleService.update(updateTricycleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tricycleService.softdelete(id);
  }
}
