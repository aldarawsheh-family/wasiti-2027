import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // إذا ما في company_id في المسار أو body — ما في حاجة للفحص
    const paramCompanyId = request.params?.companyId || request.params?.id || request.body?.company_id;
    if (!paramCompanyId) return true;

    const userRole = request.headers['user-role'] || request.role;
    const userCompanyId = request.headers['company-id'] || request.companyId;

    // Admin/PLATFORM_OWNER — يقدروا يتجاوزوا
    if (userRole === 'ADMIN' || userRole === 'PLATFORM_OWNER') {
      return true;
    }

    // باقي المستخدمين — لازم company_id يطابق
    if (!userCompanyId || userCompanyId !== paramCompanyId) {
      throw new ForbiddenException('Tenant scope violation');
    }

    return true;
  }
}