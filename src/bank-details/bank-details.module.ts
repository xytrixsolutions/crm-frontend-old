import { Module } from '@nestjs/common';
import { BankDetailsService } from './bank-details.service';
import { BankDetailsController } from './bank-details.controller';
import { BusinessProfileModule } from '../business-profile/business-profile.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankDetail } from './entities/bank-detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankDetail]), BusinessProfileModule],
  controllers: [BankDetailsController],
  providers: [BankDetailsService],
})
export class BankDetailsModule {}
