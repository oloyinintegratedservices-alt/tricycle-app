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
import { JwtGuard } from '../common/guards/jwt.guard';
import { CreateStaffDto } from './dto/create-staff.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleName } from 'generated/prisma/enums';
import { CreateAdminDto } from './dto/create-admin.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../common/decorators/get-user.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Patch()
  updateUser(@Body() dto: UpdateUserDto) {
    return this.userService.updateUser(dto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get()
  async getUsers(@Query() query: GetUsersDto) {
    return this.userService.getUsers(query);
  }

  @Roles(RoleName.user)
  @Get('investment')
  getUserInvestments(@GetUser('userId') userId: string) {
    return this.userService.getUserInvestments(userId);
  }

  @Roles(RoleName.user)
  @Get('order')
  getUserOrders(@GetUser('userId') userId: string) {
    return this.userService.getUserOrders(userId);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.softdelete(id);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Post('staff')
  createStaff(@Body() createStaffDto: CreateStaffDto) {
    return this.userService.createStaff(createStaffDto);
  }

  @Roles(RoleName.super_admin)
  @Post('admin')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.userService.createAdmin(createAdminDto);
  }

  @Roles(RoleName.super_admin, RoleName.admin, RoleName.staff)
  @Get('staff')
  async getStaffs(@Query() query: GetUsersDto) {
    return this.userService.getStaffs(query);
  }
}
