import { SignInDto } from '../../auth/dto/signin-dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateBusinessProfileDto } from '../../business-profile/dto/create-business-profile.dto';

export interface CreateUserInterface extends CreateUserDto {
  status: string;
  ipAddress: string;
  deviceToken?: string;
}

export interface LoginUserInterface extends SignInDto {
  ipAddress: string;
}

export interface CreateUserByAdminInterface
  extends CreateUserDto,
    CreateBusinessProfileDto {}
