import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
      });
      if (!employee) {
        throw new NotFoundException('Employe Not Found!');
      }
      return this.prisma.employee.update({
        where: { id },
        data: updateEmployeeDto,
      });
    } catch (error) {
      throw new BadRequestException('Employe Can not be Updated!');
    }
  }

  async remove(id: number) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: { id },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      return this.prisma.employee.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Employe Can not be Delete!');
    }
  }

  async profile(id: number) {
    try {
      const employee = this.prisma.employee.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch {
      throw new BadRequestException('Can Not Get Profile!');
    }
  }
}
