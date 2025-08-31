import { forwardRef, Module } from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { BusinessProfileController } from './business-profile.controller';
import { BusinessProfile } from './entities/business-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessProfile]),
    forwardRef(() => UserModule),
  ],
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService],
  exports: [BusinessProfileService],
})
export class BusinessProfileModule {}
