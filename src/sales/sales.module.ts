import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { SaleItem } from './entities/sale-item.entity';
import { EmailModule } from '../email/email.module';
import { LeadsModule } from '../leads/leads.module';
import { BusinessProfileModule } from '../business-profile/business-profile.module';
import { Vat } from '../admin/entities/vat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleItem, Vat]),
    EmailModule,
    LeadsModule,
    BusinessProfileModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesModule {}
