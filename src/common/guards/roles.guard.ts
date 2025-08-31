/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../annotations/roles.decorator';
import { Role } from '../enums/role.enum';
import { CustomException } from '../exceptions/custom-exception';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      // No roles required, allow access
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      // No user found in request, deny access
      throw new CustomException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const userObj = user as { sub: number; email: string };
    const authUser = await this.userService.findOneById(userObj?.sub);

    const hasRole = requiredRoles.some((role) => authUser?.role === role);

    if (!hasRole) {
      throw new CustomException(
        'Insufficient permissions',
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
