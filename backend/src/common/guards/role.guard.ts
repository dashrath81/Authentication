import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // If no @Roles() decorator is present, allow access.
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    // Added by JwtAuthGuard
    const user = request.user;

    return requiredRoles.includes(user.role);
  }
}