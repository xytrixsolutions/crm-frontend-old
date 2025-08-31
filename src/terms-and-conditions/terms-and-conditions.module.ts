import { Module } from '@nestjs/common';
import { TermsAndConditionsService } from './terms-and-conditions.service';
import { TermsAndConditionsController } from './terms-and-conditions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TermsAndCondition } from './entities/terms-and-condition.entity';
import { BusinessProfileModule } from '../business-profile/business-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TermsAndCondition]),
    BusinessProfileModule,
  ],
  controllers: [TermsAndConditionsController],
  providers: [TermsAndConditionsService],
})
export class TermsAndConditionsModule {}
