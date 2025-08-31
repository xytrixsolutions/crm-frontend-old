import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LeadsService } from 'src/leads/leads.service';
import { Status } from '../enums/status.enum';

@Injectable()
export class LeadStatusCron {
  constructor(private readonly leadService: LeadsService) {}

  private readonly logger = new Logger(LeadStatusCron.name);

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.debug('Lead status cron job started');
    console.log('Lead status cron job running');

    const leads = await this.leadService.findAllLeadActions();

    if (leads && leads?.length > 0) {
      await Promise.all(
        leads.map(async (lead) => {
          const isIgnored =
            new Date().getTime() - lead.createdAt > 2 * 24 * 60 * 60 * 1000 &&
            lead.status === (Status.VIEWED as string);
          const isExpired =
            new Date().getTime() - lead.createdAt > 30 * 24 * 60 * 60 * 1000 &&
            lead.status === (Status.IGNORED as string);

          if (isExpired) {
            lead.status = Status.EXPIRED;
          } else if (isIgnored) {
            lead.status = Status.IGNORED;
          }
          await this.leadService.updateLeadAction(lead.id, {
            status: lead.status,
          });
        }),
      );
    }
  }
}
