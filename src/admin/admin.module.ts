import { Module } from '@nestjs/common';
import { AdminService } from './services/admin.service';
import { AdminController } from './controllers/admin.controller';
import { Vat } from './entities/vat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VatController } from './controllers/vat.controller';
import { VatService } from './services/vat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vat])],
  controllers: [AdminController, VatController],
  providers: [AdminService, VatService],
})
export class AdminModule {}
