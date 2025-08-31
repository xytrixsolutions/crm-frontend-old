import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { Package } from './entities/package.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessPackage } from './entities/business-package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Package]),
    TypeOrmModule.forFeature([BusinessPackage]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
