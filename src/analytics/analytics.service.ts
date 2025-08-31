/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { LeadsService } from 'src/leads/leads.service';
import { PackagesService } from 'src/packages/packages.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly leadService: LeadsService,
    private readonly businessPackageService: PackagesService,
  ) {}

  async getAnalyticsData(userId?: number): Promise<any> {
    const analytics = await this.leadService.countLeads(userId);

    const businessPackage =
      await this.businessPackageService.getCurrentBusinessPackage(userId!);

    return { analytics, businessPackage };
  }
}
