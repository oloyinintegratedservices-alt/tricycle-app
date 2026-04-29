import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'generated/prisma/enums';
import { CreateAdminDto } from './dto/create-admin.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles()
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles()
  @Patch()
  updateUser(@Body() dto: UpdateUserDto) {
    return this.userService.updateUser(dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles()
  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    return this.userService.getUsers(query);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.softdelete(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles()
  @Post('staff')
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.userService.createStaff(createStaffDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(RoleName.super_admin)
  @Post('admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.userService.createAdmin(createAdminDto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles()
  @Get('staff')
  async getStaffs(@Query() query: GetUsersDto) {
    return this.userService.getStaffs(query);
  }
}
