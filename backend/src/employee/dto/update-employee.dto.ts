import { IsEmail, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  name?: string;
  @IsOptional()
  @IsInt()
  departmentId?: number;
}
