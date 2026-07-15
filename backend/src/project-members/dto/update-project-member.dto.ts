import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectMemberDto } from './create-project-member.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateProjectMemberDto {
    @IsOptional()
  @IsInt()
  employeeId?: number;

  @IsOptional()
  @IsInt()
  projectID?: number;
}
