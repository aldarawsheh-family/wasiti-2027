import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { Role } from './common/enums/roles.enum';
import { Permission } from './common/enums/permissions.enum';

@Injectable()
export class RbacService {
  private db: Pool;
  private redis: Redis;

  // خريطة افتراضية للاستخدام المؤقت حتى تجهز جداول DB
  private readonly defaultPermissions: Record<string, string[]> = {
    [Role.PLATFORM_OWNER]: Object.values(Permission),
    [Role.ADMIN]: [
      Permission.USERS_READ, Permission.USERS_UPDATE, Permission.USERS_DELETE,
      Permission.LISTINGS_MANAGE, Permission.DEALS_MANAGE,
      Permission.WALLET_VIEW, Permission.WALLET_APPROVE, Permission.WALLET_REJECT,
      Permission.SUPPORT_MANAGE, Permission.ANALYTICS_VIEW, Permission.AUDIT_VIEW,
      Permission.FINANCE_VIEW, Permission.SYSTEM_MONITOR,
    ],
    [Role.SUPPORT]: [Permission.USERS_READ, Permission.SUPPORT_MANAGE],
    [Role.MODERATOR]: [Permission.USERS_READ, Permission.LISTINGS_MANAGE],
    [Role.COMPANY_ADMIN]: [Permission.USERS_READ],
    [Role.SELLER]: [Permission.USERS_READ],
    [Role.USER]: [Permission.USERS_READ],
  };

  constructor() {
    try {
      this.db = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgres://wasity:wasity@postgres:5432/wasity',
      });
    } catch {}
    try {
      this.redis = new Redis({ host: process.env.REDIS_URL?.split('//')[1]?.split(':')[0] || 'redis', port: 6379 });
    } catch {}
  }

  async getPermissionsByRole(role: string): Promise<string[]> {
    const cacheKey = `rbac:role:${role}`;

    // جرب Redis أولاً
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {}

    // جرب DB
    try {
      const result = await this.db.query(
        `SELECT p.key FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         JOIN roles r ON r.id = rp.role_id
         WHERE r.key = $1`,
        [role],
      );
      if (result.rows.length > 0) {
        const permissions = result.rows.map((r: any) => r.key);
        try { await this.redis.setex(cacheKey, 300, JSON.stringify(permissions)); } catch {}
        return permissions;
      }
    } catch {}

    // Fallback: القيم الافتراضية
    return this.defaultPermissions[role] || [];
  }

  async hasPermission(userId: string, permissionKey: string): Promise<boolean> {
    try {
      const result = await this.db.query(
        `SELECT role FROM auth.users WHERE id = $1`,
        [userId],
      );
      if (result.rows.length > 0) {
        const role = result.rows[0].role;
        const permissions = await this.getPermissionsByRole(role);
        return permissions.includes(permissionKey);
      }
    } catch {}
    return false;
  }
}