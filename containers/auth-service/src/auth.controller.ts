// ══════════════════════════════════════════════════
// WASITI 2027 — Auth Service — Controller
// ══════════════════════════════════════════════════

import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Headers('tenant-id') tenantId: string,
    @Body() body: { email: string; password: string; displayName?: string },
  ) {
    return this.authService.register(tenantId, body);
  }

  @Post('login')
  async login(
    @Headers('tenant-id') tenantId: string,
    @Body() body: { email: string; password: string },
  ) {
    return this.authService.login(tenantId, body.email, body.password);
  }

  @Post('refresh')
  async refresh(
    @Body() body: { refreshToken: string },
  ) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(
    @Headers('authorization') auth: string,
  ) {
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    await this.authService.logout(token);
    return { message: 'Logged out successfully' };
  }
}