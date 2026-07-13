import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}
  async create(createProfileDto: CreateProfileDto) {
    try {
      const employee = await this.prisma.employee.findUnique({
        where: {
          id: createProfileDto.employeeId,
        },
      });
      if (!employee) {
        throw new NotFoundException(' Employee Not Found!');
      }

      const profile = await this.prisma.profile.create({
        data: {
          dateOfBirth: createProfileDto.dateOfBirth,
          phone: createProfileDto.phone,
          address: createProfileDto.address,
          skills: createProfileDto.skills,
          employee: {
            connect: {
              id: createProfileDto.employeeId,
            },
          },
        },
      });

      return profile;
    } catch {
      throw new BadRequestException('Profile Not Found!');
    }
  }

  findAll() {
    try {
      return this.prisma.profile.findMany();
    } catch {
      throw new BadRequestException('Not Found!');
    }
  }

  findOne(id: number) {
    try {
      const profile = this.prisma.profile.findUnique({
        where: {
          id,
        },
      });
      return profile;
    } catch {
      throw new BadRequestException('Not Found!');
    }
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile Not Found!');
    }

    return await this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        ...updateProfileDto,
      },
    });
  }

  async remove(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        id,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile Not Found!');
    }

    return await this.prisma.profile.delete({
      where: {
        id,
      },
    });
  }
}
