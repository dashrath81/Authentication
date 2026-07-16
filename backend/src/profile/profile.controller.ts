import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { multerOptions } from './multer.config';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  //create profile
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  //get all profile
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  
  findAll() {
    return this.profileService.findAll();
  }

  //get profile
  @Get(':employeeId')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.profileService.findOne(employeeId);
  }

  //update profile
  @Patch(':employeeId')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('employeeId') employeeId: number,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.update(employeeId, dto, file);
  }

  //delete profile
  @Delete(':employeeId')
  @UseGuards(JwtAuthGuard)
  remove(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.profileService.remove(employeeId);
  }

  //profile img
  @Post(':employeeId/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  uploadImage(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadImage(employeeId, file.filename);
  }
}
