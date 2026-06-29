import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      
      // تحقق من Blacklist
      const isBlacklisted = await this.redisService.get(lacklist:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI3MzU2ZmU2Yi1hYjk1LTRhYzctOWM0NS04ZTFjZTg0OGI0NTciLCJ0ZW5hbnRJZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzgyNjI2MTM5LCJleHAiOjE3ODI2MjcwMzl9.ZrG6VIxUzgwnOi1v693bwCsrMTEJwUF75ZQBWiP9RPM);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
      // ًں”¥ ط§ظ„ط­ظ‚ظ†: ظ†ط¶ط¹ userId ظپظٹ ط§ظ„ظ€ Request
request.userId = payload.userId || payload.sub || payload.id;
request.tenantId = payload.tenantId;      
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    return authHeader.split(' ')[1];
  }
}
