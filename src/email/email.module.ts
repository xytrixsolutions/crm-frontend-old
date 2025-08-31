import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { Email } from './entities/email.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { LeadsModule } from '../leads/leads.module';

@Module({
  imports: [UserModule, LeadsModule, TypeOrmModule.forFeature([Email])],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
