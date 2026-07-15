import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async Register(createAuthDto: CreateAuthDto) {
    try {
      const existingUser = await this.prisma.employee.findUnique({
        where: {
          email: createAuthDto.email,
        },
      });
      if (existingUser) {
        throw new ConflictException('User already exists');
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
    } catch {
      throw new BadRequestException('User Registration Faild!');
    }
  }

  async Login(updateAuthDto: UpdateAuthDto) {
    try {
      const existingUser = await this.prisma.employee.findUnique({
        where: {
          email: updateAuthDto.email,
        },
      });
      if (!existingUser) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(
        updateAuthDto.password,
        existingUser.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = {
        id:existingUser.id,
        sub: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      };

      const token = this.jwtService.sign(payload);
      const { password, ...employeeWithoutPassword } = existingUser;

      return {
        access_token: token,
        user: employeeWithoutPassword,
      };
    } catch {
      throw new BadRequestException('Login Faild!');
    }
  }
}
