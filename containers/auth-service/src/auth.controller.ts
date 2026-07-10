import { Controller, Post, Get, Body, Headers, UnauthorizedException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Headers('tenant-id') tenantId: string, @Body() body: { email: string; password: string; displayName?: string }) {
    return this.authService.register(tenantId, body);
  }

  @Post('login')
  async login(
    @Headers('tenant-id') tenantId: string,
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: any
  ) {
    const result = await this.authService.login(tenantId, body.email, body.password);
    
    res.cookie('auth_token', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return result;
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  async logout(@Headers('authorization') auth: string) {
    if (!auth) throw new UnauthorizedException();
    const token = auth.replace('Bearer ', '');
    await this.authService.logout(token);
    return { message: 'Logged out successfully' };
  }

  @Get('verify')
  async verify(@Headers('authorization') auth: string) {
    if (!auth) throw new UnauthorizedException('No token');
    return { valid: true };
  }
}