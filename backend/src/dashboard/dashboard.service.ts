import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Status } from '@prisma/client';
@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [
      totalEmployees,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    ] = await Promise.all([
      this.prisma.employee.count(),
      this.prisma.project.count(),
      this.prisma.tasks.count(),
      this.prisma.tasks.count({
        where: {
          status: 'COMPLETED',
        },
      }),
      this.prisma.tasks.count({
        where: {
          status: 'PEDING',
        },
      }),
      this.prisma.tasks.count({
        where: {
          status: 'IN_PROGRESS',
        },
      }),
    ]);

    return {
      totalEmployees,
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    };
  }

  async employedashboard(userId: number) {
    const employee = this.prisma.employee.findUnique({ where: { id: userId } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const [myProjects, myTasks, completedTasks, pendingTasks, inProgressTasks] =
      await Promise.all([
        this.prisma.projectMember.count({
          where: {
            employeeId: userId,
          },
        }),
        this.prisma.tasks.count({
          where: {
            employeeId: userId,
          },
        }),
        this.prisma.tasks.count({
          where: {
            employeeId: userId,
            status: Status.COMPLETED,
          },
        }),
        this.prisma.tasks.count({
          where: {
            employeeId: userId,
            status: Status.PEDING,
          },
        }),
        this.prisma.tasks.count({
          where: {
            employeeId: userId,
            status: Status.IN_PROGRESS,
          },
        }),
      ]);

    return {
      myProjects,
      myTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
    };
  }
}
