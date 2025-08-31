import { IsEmail, IsEnum, IsNotEmpty, Length } from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(8)
  password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
