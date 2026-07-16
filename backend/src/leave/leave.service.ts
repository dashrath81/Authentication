import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { UpdateLeaveStatusDto } from './dto/update-leave-status.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LeaveStatus } from '@prisma/client';

@Injectable()
export class LeaveService {
  constructor(private prisma: PrismaService) {}
  async create(createLeaveDto: CreateLeaveDto, employeeId) {
    if (new Date(createLeaveDto.startDate) > new Date(createLeaveDto.endDate)) {
      throw new BadRequestException('Start date cannot be after end date');
    }
    return await this.prisma.leave.create({
      data: {
        employeeId,
        leaveType: createLeaveDto.leaveType,
        startDate: createLeaveDto.startDate,
        endDate: createLeaveDto.endDate,
        reason: createLeaveDto.reason,
      },
    });
  }

  // all leave
  findAll() {
    return this.prisma.leave.findMany();
  }
  //all leave of emp
  async findAllEmp(employeeId: number) {
    return this.prisma.leave.findMany({
      where: {
        employeeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  //find one leave
  async findOne(id: number, employeeId: number) {
    const leave = await this.prisma.leave.findFirst({
      where: {
        id,
        employeeId,
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    return leave;
  }

  //update leave emp
  async update(id: number, employeeId: number, updateLeaveDto: UpdateLeaveDto) {
    const leave = await this.prisma.leave.findFirst({
      where: {
        id,
        employeeId,
      },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Only pending leave can be updated');
    }

    return this.prisma.leave.update({
      where: {
        id,
      },
      data: {
        ...updateLeaveDto,
      },
    });
  }

  remove(id: number) {
    return this.prisma.leave.delete({ where: { id } });
  }

  // approve and reject leave
  async updateStatus(
    id: number,
    approvedBy: number,
    updateLeaveStatusDto: UpdateLeaveStatusDto,
  ) {
    const leave = await this.prisma.leave.findUnique({
      where: { id },
    });

    if (!leave) {
      throw new NotFoundException('Leave not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new BadRequestException('Leave has already been processed');
    }

    return this.prisma.leave.update({
      where: { id },
      data: {
        status: updateLeaveStatusDto.status,
        approvedBy,
        approvedAt: new Date(),
      },
    });
  }
}
