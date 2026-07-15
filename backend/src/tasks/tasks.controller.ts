import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Create Tasks
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  //Get All Tasks
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findAll() {
    return this.tasksService.findAll();
  }

  // Get Singele Task
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(Number(id));
  }

  // Eployee All Tasks
  @Get('employee/:employeeId')
  @UseGuards(JwtAuthGuard)
  findByEmployee(@Param('employeeId') employeeId: number) {
    return this.tasksService.findByEmployee(employeeId);
  }

  // Update Tasks Admin and manager Only
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(Number(id), updateTaskDto);
  }

  // Update Tasks For User (Can Only Change Status)
  @Patch('employee/:id')
  @UseGuards(JwtAuthGuard)
  updateemp(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(Number(id), updateTaskDto);
  }

  //Delete Tasks
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(Number(id));
  }
}
