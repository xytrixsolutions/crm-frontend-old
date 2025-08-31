import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PackagesService } from 'src/packages/packages.service';
import { NotificationService } from 'src/notification/notification.service';
import { ConfigService } from '@nestjs/config';
import { Status } from '../enums/status.enum';
import { PaginateQuery } from 'nestjs-paginate';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SendPackageExpiryNotificationCron {
  constructor(
    private readonly packageService: PackagesService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(SendPackageExpiryNotificationCron.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('Package expiry cron job started');
    console.log('Package expiry cron job running');

    const packages = await this.packageService.findAllBusinessPackages(
      {
        filter: { status: Status.ACTIVE },
      } as unknown as PaginateQuery,
      true,
    );

    if (packages && packages?.data?.length > 0) {
      await Promise.all(
        packages?.data.map(async (item) => {
          if (!item.expiresAt) {
            return;
          }
          const expiryDate = new Date(Number(item.expiresAt));
          const currentDate = new Date();
          const timeDifference = expiryDate.getTime() - currentDate.getTime();
          const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

          const tokens = await this.authService.findAllTokens(
            item.business.user.id,
          );

          if (daysDifference <= 7 && daysDifference >= 0 && tokens.length > 0) {
            await this.notificationService.sendNotificationToMultipleTokens({
              tokens: tokens.map((item) => item.deviceToken) || [],
              title: 'Package Expiry Reminder',
              body: `Your package will expire in ${daysDifference} day(s). Please renew it to continue enjoying our services.`,
              icon: this.configService.get<string>('LOGO_URL')!,
              userId: item.business?.user?.id,
            });
          }

          if (daysDifference < 0) {
            await this.packageService.updateBusinessPackage(item.id, {
              status: Status.EXPIRED,
            });
          }
        }),
      );
    }
  }
}
