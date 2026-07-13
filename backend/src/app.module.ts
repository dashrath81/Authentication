import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';
import { TasksModule } from './tasks/tasks.module';
import { ProjectModule } from './project/project.module';
import { ProjectMembersModule } from './project-members/project-members.module';

@Module({
  imports: [EmployeeModule, AuthModule, PrismaModule, ProfileModule, TasksModule, ProjectModule, ProjectMembersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
