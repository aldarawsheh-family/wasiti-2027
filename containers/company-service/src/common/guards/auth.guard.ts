import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('Authentication required');
    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.userId = payload.userId || payload.sub || payload.id;
      request.tenantId = payload.tenantId;
      request.role = payload.role;
      return true;
    } catch { throw new UnauthorizedException('Invalid token'); }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return null;
    return authHeader.split(' ')[1];
  }
}
