import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskDtoEmp } from './dto/update-task-emp';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: {
          id: createTaskDto.employeeId,
        },
      });
      if (!employee) {
        throw new NotFoundException('Employee Not Fount!');
      }
      const task = this.prisma.tasks.create({
        data: {
          title: createTaskDto.title,
          description: createTaskDto.description,
          dueDate: createTaskDto.dueDate,
          status: createTaskDto.status,

          employee: {
            connect: {
              id: createTaskDto.employeeId,
            },
          },
        },
      });
      return task;
    } catch {
      throw new BadRequestException('Can Not Create Task!');
    }
  }

  findAll() {
    try {
      const tasks = this.prisma.tasks.findMany();
      return tasks;
    } catch {
      throw new BadRequestException('Can Not Find Task!');
    }
  }

  findOne(id: number) {
    try {
      const task = this.prisma.tasks.findUnique({
        where: {
          id,
        },
      });
      return task;
    } catch {
      throw new BadRequestException(' Not Found');
    }
  }

  async findByEmployee(employeeId: number) {
  const employee = await this.prisma.employee.findUnique({
    where: { id: employeeId },
  });

  if (!employee) {
    throw new NotFoundException('Employee Not Found!');
  }

  try {
    const tasks = await this.prisma.tasks.findMany({
      where: { employeeId },
      orderBy: { dueDate: 'asc' },
    });
    return tasks;
  } catch {
    throw new BadRequestException('Can Not Fetch Tasks!');
  }
}

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const task = this.prisma.tasks.findUnique({
        where: {
          id,
        },
      });
      if (!task) {
        throw new NotFoundException('Task Not Found!');
      }

      return await this.prisma.tasks.update({
        where: {
          id,
        },
        data: {
          ...updateTaskDto,
        },
      });
    } catch {
      throw new BadRequestException('Can Not Update!');
    }
  }
  async updateemp(id: number, updateTaskDtoEmp: UpdateTaskDtoEmp) {
    try {
      const task = this.prisma.tasks.findUnique({
        where: {
          id,
        },
      });
      if (!task) {
        throw new NotFoundException('Task Not Found!');
      }

      return await this.prisma.tasks.update({
        where: {
          id,
        },
        data: {
          ...updateTaskDtoEmp,
        },
      });
    } catch {
      throw new BadRequestException('Can Not Update!');
    }
  }

  async remove(id: number) {
    try {
      const task = this.prisma.tasks.findUnique({
        where: {
          id,
        },
      });
      if (!task) {
        throw new NotFoundException('Task Not Found!');
      }

      return await this.prisma.tasks.delete({
        where: {
          id,
        },
      });
    } catch {
      throw new BadRequestException('Can Not Delete!');
    }
  }
}
