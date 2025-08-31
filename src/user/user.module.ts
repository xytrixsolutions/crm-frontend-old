import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfileModule } from '../business-profile/business-profile.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => BusinessProfileModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
