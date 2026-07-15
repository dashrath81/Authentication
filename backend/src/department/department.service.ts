import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      const department = await this.prisma.department.create({
        data: {
          name: createDepartmentDto.name,
          description: createDepartmentDto.description,
        },
      });
      return `${department.name} Department Created`;
    } catch {
      throw new BadRequestException('Can Not create department!');
    }
  }

  findAll() {
    return this.prisma.department.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    const department = this.prisma.department.findUnique({
      where: {
        id,
      },
    });
    return department;
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const updatedDepartment = await this.prisma.department.update({
      where: {
        id,
      },
      data: updateDepartmentDto,
    });

    return updatedDepartment;
  }

  remove(id: number) {
    return this.prisma.department.delete({ where: { id } });
  }
}
