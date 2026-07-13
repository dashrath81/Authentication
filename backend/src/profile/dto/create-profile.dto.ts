import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsOptional()
  @IsString()
  skills?: string;
  @IsInt()
  employeeId?: number;
}
