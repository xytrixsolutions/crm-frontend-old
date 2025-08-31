import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class ExpireTokenCron {
  constructor(private readonly authService: AuthService) {}

  private readonly logger = new Logger(ExpireTokenCron.name);

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.debug('Expire token cron job started');
    console.log('Expire token cron job running');

    const tokens = await this.authService.findAllTokens();

    await Promise.all(
      tokens.map(async (token) => {
        const isExpired =
          token.expiresAt < new Date().getTime() ||
          token.refreshTokenExpiresAt < new Date().getTime();

        if (isExpired) {
          await this.authService.deleteToken(token.id);
        }
      }),
    );
  }
}
