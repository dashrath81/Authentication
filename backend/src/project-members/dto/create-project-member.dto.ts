import { IsArray, IsInt } from 'class-validator';

export class CreateProjectMemberDto {
  @IsArray()
  employeeId!: number[];
  @IsInt()
  projectID!: number;
}
