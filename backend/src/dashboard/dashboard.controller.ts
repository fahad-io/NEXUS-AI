import { Controller, Get, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('bearer')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@Request() req: any) {
    return this.dashboardService.getStats(req.user.id);
  }

  @Get('history')
  getHistory(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.dashboardService.getHistory(
      req.user.id,
      Number(page),
      Number(limit),
    );
  }

  @Get('billing')
  getBilling(@Request() req: any) {
    return this.dashboardService.getBilling(req.user.id);
  }
}
