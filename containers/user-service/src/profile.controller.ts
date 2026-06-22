// ══════════════════════════════════════════════════
// WASITI 2027 — User Service — Profile Controller
// ══════════════════════════════════════════════════

import { Controller, Post, Get, Param, Headers, UploadedFile, UseInterceptors } from '@nestjs/common';

@Controller('profile')
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