import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../../src/prisma/prisma.service';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    

    return this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: number) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.employee.delete({
      where: { id },
    });
  }
}