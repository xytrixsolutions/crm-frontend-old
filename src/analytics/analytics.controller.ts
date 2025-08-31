import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { SuccessMessage } from 'src/common/annotations/success-message.decorator';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @SuccessMessage('Analytics fetched successfully')
  @Get()
  async analytics(@Req() req: Request): Promise<any> {
    const user = req.user as { sub: number; email: string };
    return await this.analyticsService.getAnalyticsData(user.sub);
  }
}
