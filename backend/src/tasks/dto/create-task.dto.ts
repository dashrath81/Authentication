import { IsDateString, IsEnum, IsInt, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  title!: string;
  
  @IsString()
  description!: string;

  @IsDateString()
  dueDate!: string;

  @IsEnum(Status)
  status!: Status;

  @IsInt()
  employeeId!: number;
}
