import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@shared';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../types/auth.type';
import { RequestWithUser } from '../types/request-with-user.type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const expectedRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // It is a public endpoint
    if (!expectedRoles || !expectedRoles?.length) {
      return true;
    }

    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest();
    const user = request.user;

    if (!user || !user?.roles || !Array.isArray(user?.roles)) {
      return false;
    }

    return expectedRoles.every((expectedRole) =>
      user.roles.includes(expectedRole),
    );
  }
}
