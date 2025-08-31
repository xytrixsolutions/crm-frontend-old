import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsNotEmpty()
  role: Role;

  @IsOptional()
  deviceToken?: string;
}
