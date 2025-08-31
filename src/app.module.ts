/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { HealthController } from './health/health.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import typeormConfig from './typeorm.config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './common/guards/accessToken.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { BusinessProfileModule } from './business-profile/business-profile.module';
import { LeadsModule } from './leads/leads.module';
import { TermsAndConditionsModule } from './terms-and-conditions/terms-and-conditions.module';
import { BankDetailsModule } from './bank-details/bank-details.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { EmailModule } from './email/email.module';
import { join } from 'path';
import { ExpireTokenCron } from './common/cron-jobs/expire-token.cron';
import { PackagesModule } from './packages/packages.module';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as admin from 'firebase-admin';
import { SalesModule } from './sales/sales.module';
import { AdminModule } from './admin/admin.module';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { NotificationModule } from './notification/notification.module';
import { LeadStatusCron } from './common/cron-jobs/lead-status.cron';
import { SendPackageExpiryNotificationCron } from './common/cron-jobs/send-package-expiry-notification.cron';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
      envFilePath: [`environments/.env.${process.env.NODE_ENV || 'local'}`],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!config) {
          throw new Error('Missing TypeORM configuration');
        }
        return config;
      },
    }),
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const transport = {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: configService.get('SMTP_SECURE') === 'true',
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASSWORD'),
          },
        };

        return {
          transport,
          defaults: {
            from: `"${configService.get('EMAIL_FROM_NAME')}" <${configService.get('EMAIL_FROM_ADDRESS')}>`,
          },
          preview: false,
          template: {
            dir: join(__dirname, '..', 'templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
              includeCallback: (filename) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return join(__dirname, '..', 'templates', filename);
              },
            },
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BusinessProfileModule,
    LeadsModule,
    TermsAndConditionsModule,
    BankDetailsModule,
    EmailModule,
    PackagesModule,
    SalesModule,
    AdminModule,
    NotificationModule,
  ],
  controllers: [AppController, HealthController, AnalyticsController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AnalyticsService,
    ExpireTokenCron,
    LeadStatusCron,
    SendPackageExpiryNotificationCron,
  ],
})
export class AppModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
}
