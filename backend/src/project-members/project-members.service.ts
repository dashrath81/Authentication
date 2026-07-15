import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectMemberDto } from './dto/create-project-member.dto';
import { UpdateProjectMemberDto } from './dto/update-project-member.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectMembersService {
  constructor(private prisma: PrismaService) {}

  //assing project members
  async create(createProjectMemberDto: CreateProjectMemberDto) {
    try {
      const { projectID, employeeId } = createProjectMemberDto;

      const project = await this.prisma.project.findUnique({
        where: { id: projectID },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }
      const employees = await this.prisma.employee.findMany({
        where: {
          id: {
            in: employeeId,
          },
        },
        select: {
          id: true,
        },
      });

      // Compare requested IDs with found IDs
      const foundIds = employees.map((employee) => employee.id);

      const missingIds = employeeId.filter((id) => !foundIds.includes(id));

      if (missingIds.length > 0) {
        throw new NotFoundException(
          `Employee(s) not found: ${missingIds.join(', ')}`,
        );
      }

      // Assign employees to project
      const projectmembers = await this.prisma.$transaction(
        employeeId.map((employeeId) =>
          this.prisma.projectMember.create({
            data: {
              employeeId,
              projectID,
            },
          }),
        ),
      );
      return projectmembers;
    } catch {
      throw new BadRequestException('Can Not Assing Member!');
    }
  }

  // find all
  async findAll() {
    return this.prisma.projectMember.findMany({
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // find one project 
  findOne(id: number) {
    const projectmember = this.prisma.projectMember.findUnique({
      where: {
        id,
      },
    });
    return projectmember;
  }

  // update project member
  async update(id: number, updateProjectMemberDto: UpdateProjectMemberDto) {
    const projectMember = await this.prisma.projectMember.findUnique({
      where: { id },
    });

    if (!projectMember) {
      throw new NotFoundException('Project member not found');
    }

    return await this.prisma.projectMember.update({
      where: { id },
      data: updateProjectMemberDto,
    });
  }

  // remove project member
  async remove(id: number) {
    const projectMember = await this.prisma.projectMember.findUnique({
      where: { id },
    });
    if (!projectMember) {
      throw new NotFoundException('Project member not found');
    }
    await this.prisma.projectMember.delete({
      where: { id },
    });
    return 'Project member removed successfully';
  }
  
  //find project member
  async findProjectMembers(projectId: number) {
  return this.prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      description: true,
      deadline: true,
      members: {
        select: {
          employee: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });
  }
}
