import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccessContorlService } from '../roles/roles.service';
import { ROLE_KEY } from '@/core/domain/decorator';
import { Reflector } from '@nestjs/core';
import { Role } from '@/shared/roles';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessContorlService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    for (const role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRole: user?.role,
      });

      if (result) {
        return true;
      }
    }

    return false;
  }
}
