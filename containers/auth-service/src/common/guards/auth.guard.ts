import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../redis.service';
import { RbacService } from '../../rbac.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const isBlacklisted = await this.redisService.get('blacklist:' + token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      request.userId = payload.userId || payload.sub || payload.id;
      request.tenantId = payload.tenantId;
      request.role = payload.role;

      if (request.userId && request.role) {
        request.permissions = await this.rbacService.getPermissionsByRole(request.role);
      } else {
        request.permissions = [];
      }

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    return authHeader.split(' ')[1] || null;
  }
}