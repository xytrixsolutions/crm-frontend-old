import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { LeadSource } from './entities/lead-source.entity';
import { VehicleDetail } from './entities/vehicle-detail.entity';
import { LeadAction } from './entities/lead-action.entity';
import { UserModule } from '../user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead]),
    TypeOrmModule.forFeature([LeadSource]),
    TypeOrmModule.forFeature([VehicleDetail]),
    TypeOrmModule.forFeature([LeadAction]),
    UserModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService],
  exports: [LeadsService],
})
export class LeadsModule {}
