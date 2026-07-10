import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import { error } from 'console';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async Register(createAuthDto: CreateAuthDto) {
    const existingUser = await this.prisma.employee.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    if (existingUser) {
      throw new error('User is Alredy Exist');
    }

    const hashdpassword = await bcrypt.hash(createAuthDto.password, 10);

    const employee = this.prisma.employee.create({
      data: {
        name: createAuthDto.name,
        email: createAuthDto.email,
        password: hashdpassword,
      },
    });

    return `User Registration Succuse with name ${(await employee).name}`;
  }

  async Login(updateAuthDto: UpdateAuthDto) {
    const existingUser = await this.prisma.employee.findUnique({
      where: {
        email: updateAuthDto.email,
      },
    });
    if (!existingUser) {
      throw new NotFoundException('Invalid UserName or Password');
    }

    const isMatch = await bcrypt.compare(
      updateAuthDto.password,
      existingUser.password,
    );

    if (!isMatch) {
      throw new NotFoundException('Invalid UserName or Password');
    }

    const payload = {
      sub: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
