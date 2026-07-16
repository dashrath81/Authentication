import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    const employee = await this.prisma.employee.findUnique({
      where: {
        id: createProfileDto.employeeId,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.prisma.profile.create({
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
  }

  async findAll() {
    const profiles = await this.prisma.profile.findMany();

    return profiles.map((profile) => ({
      ...profile,
      image: profile.image
        ? `http://localhost:3000/profile/${profile.image}`
        : null,
    }));
  }

  async findOne(employeeId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        employeeId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return {
      ...profile,
      image: profile.image
        ? `http://localhost:3000/profile/${profile.image}`
        : null,
    };
  }

  async update(
    employeeId: number,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    return this.prisma.profile.update({
      where: { employeeId },
      data: {
        ...dto,
        ...(file && { image: file.filename }),
      },
    });
  }

  async remove(employeeId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        employeeId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.delete({
      where: {
        employeeId,
      },
    });
  }

  async uploadImage(employeeId: number, filename: string) {
    const profile = await this.prisma.profile.findUnique({
      where: {
        employeeId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.update({
      where: {
        employeeId,
      },
      data: {
        image: filename,
      },
    });
  }
}
