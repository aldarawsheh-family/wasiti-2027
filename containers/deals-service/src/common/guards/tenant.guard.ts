import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const jwtTenantId = request.tenantId;
    const headerTenantId = request.headers['tenant-id'];

    if (!jwtTenantId) {
      throw new ForbiddenException('No tenant context found');
    }

    if (headerTenantId && headerTenantId !== jwtTenantId) {
      throw new ForbiddenException('Tenant mismatch');
    }

    return true;
  }
}
