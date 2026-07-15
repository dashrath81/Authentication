import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PrismaService } from '../../src/prisma/prisma.service';

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
      return await this.prisma.employee.update({
        where: { id },
        data: updateEmployeeDto,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          departmentId: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Employe Can not be Updated!');
    }
  }

  async findAll() {
    try {
      const Employe = this.prisma.employee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      if (!Employe) {
        throw new NotFoundException('Employee Not Found!');
      }
      return Employe;
    } catch {
      throw new BadRequestException('Can Not Find!');
    }
  }
}
