import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/role.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles(Role.ADMIN)
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.Register(createAuthDto);
  }

  @Post('login')
  login(@Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.Login(updateAuthDto);
  }
}
