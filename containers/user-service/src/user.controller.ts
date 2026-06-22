// ══════════════════════════════════════════════════
// WASITI 2027 — User Service — Controller
// ══════════════════════════════════════════════════

import { Controller, Get, Put, Body, Param, Headers } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.userService.getUser(tenantId, id);
  }

  @Put(':id')
  async updateUser(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { displayName?: string; phone?: string; language?: string; theme?: string },
  ) {
    return this.userService.updateUser(tenantId, id, body);
  }

  @Get(':id/trust')
  async getTrustScore(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.userService.getTrustScore(tenantId, id);
  }
}