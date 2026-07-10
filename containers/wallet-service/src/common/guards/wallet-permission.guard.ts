import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Inject } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class WalletPermissionGuard implements CanActivate {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const requiredPermission = Reflect.getMetadata("walletPermission", handler);

    if (!requiredPermission) {
      return true;
    }

    // PLATFORM_OWNER و ADMIN يملكون كل الصلاحيات تلقائياً
    const role = request.role || request.user?.role;
    if (role === 'PLATFORM_OWNER' || role === 'ADMIN') {
      return true;
    }

    const adminUserId = request.userId;
    const result = await this.pool.query(
      `SELECT 1 FROM wallet.admin_permissions
       WHERE admin_user_id = $1 AND permission_code = $2 AND revoked_at IS NULL`,
      [adminUserId, requiredPermission]
    );

    if (!result.rows.length) {
      throw new ForbiddenException("Missing wallet permission: " + requiredPermission);
    }

    return true;
  }
}

// Decorator
export const WalletPermission = (permission: string) => {
  return (target: any, key?: string, descriptor?: any) => {
    Reflect.defineMetadata("walletPermission", permission, descriptor.value);
    return descriptor;
  };
};