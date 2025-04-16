import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    const user = session?.userData;
    if (!user) {
      throw new UnauthorizedException('You must be logged in');
    }

    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const userRole = user.role;

    console.log('🧾 User Role:', userRole);
    console.log('🔐 Required Roles:', requiredRoles);

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
