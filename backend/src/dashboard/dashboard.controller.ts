import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  //Admin dashboard route
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  getDashboard() {
    return this.dashboardService.dashboard();
  }

  //employee dashboard route
  @Get("employee")
  @UseGuards(JwtAuthGuard)
  getEmployeDashboard(@Req() req) {
    return this.dashboardService.employedashboard(req.user.id);
  }
}
