import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(createProjectDto: CreateProjectDto, userId: number) {
    try {
      const project = this.prisma.project.create({
        data: {
          name: createProjectDto.name,
          description: createProjectDto.description,
          deadline: createProjectDto.deadline,
          creator: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return project;
    } catch {
      throw new BadRequestException('Can Not Project!');
    }
  }

  findAll() {
    return this.prisma.project.findMany();
  }

  findOne(id: number) {
    const project = this.prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      throw new NotFoundException('Can Not Fount Project!');
    }
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    try {
      const project = await this.prisma.project.findUnique({ where: { id } });
      if (!project) {
        throw new NotFoundException(`Project with ID ${id} Not Found!`);
      }
      const updateProject = await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      });
      return updateProject;
    } catch {
      throw new BadRequestException('Can Not Update!');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.project.delete({ where: { id } });
    } catch {
      throw new BadRequestException('Can Not Delete!');
    }
  }
}
