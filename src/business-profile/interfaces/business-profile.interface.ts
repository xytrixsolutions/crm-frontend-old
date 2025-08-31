import { CreateBusinessProfileDto } from '../dto/create-business-profile.dto';

export interface UserBusinessProfile extends CreateBusinessProfileDto {
  userId: number;
}
