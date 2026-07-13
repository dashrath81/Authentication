import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}
  async create(createProjectDto: CreateProjectDto) {
    try {
      const project = this.prisma.project.create({
        data: {
          name: createProjectDto.name,
          description: createProjectDto.description,
          deadline: createProjectDto.deadline,
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
      where:{id},
    })
    if(!project){
      throw new NotFoundException('Can Not Fount Project!')
    }
    return project;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
