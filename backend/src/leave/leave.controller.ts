import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/role.decorator';
import { Role } from '@prisma/client';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createLeaveDto: CreateLeaveDto, @Req() req: any) {
    return this.leaveService.create(createLeaveDto, req.user.id);
  }

  // get all leave
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll() {
    return this.leaveService.findAll();
  }
  //get leave of emp
  @Get('My-leave')
  @UseGuards(JwtAuthGuard)
  findAllEmp(@Req() req: any) {
    return this.leaveService.findAllEmp(req.user.id);
  }

  //find one leave
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.leaveService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveDto: UpdateLeaveDto,
    @Req() req: any,
  ) {
    return this.leaveService.update(id, req.user.id, updateLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(Number(id));
  }

  //Approve and reject leave
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveStatusDto: UpdateLeaveStatusDto,
    @Req() req: any,
  ) {
    return this.leaveService.updateStatus(
      id,
      req.user.id,
      updateLeaveStatusDto,
    );
  }
}
