// ══════════════════════════════════════════════════
// WASITI 2027 — User Service — Profile Controller
// ══════════════════════════════════════════════════

import { Controller, Post, Get, Param, Headers, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('profile')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
@Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
export class ProfileController {

  @Get(':id')
  async getProfile(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return {
      message: 'Profile endpoint',
      tenantId,
      userId: id,
    };
  }

  @Post(':id/avatar')
  async uploadAvatar(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return {
      message: 'Avatar upload endpoint',
      tenantId,
      userId: id,
    };
  }
}