import { User } from '../../user/entities/user.entity';
import { Token } from '../entities/token.entity';

export interface AuthenticatedUser extends Omit<User, 'password'> {
  token: Token;
}
