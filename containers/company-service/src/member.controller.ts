// ══════════════════════════════════════════════════
// WASITI 2027 — Company Service — Member Controller
// ══════════════════════════════════════════════════

import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller(':companyId/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  async add(
    @Headers('tenant-id') tenantId: string,
    @Param('companyId') companyId: string,
    @Body() body: { userId: string; role: string },
  ) {
    return this.memberService.add(tenantId, companyId, body.userId, body.role);
  }

  @Get()
  async list(
    @Headers('tenant-id') tenantId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.memberService.list(tenantId, companyId);
  }

  @Delete(':userId')
  async remove(
    @Headers('tenant-id') tenantId: string,
    @Param('companyId') companyId: string,
    @Param('userId') userId: string,
  ) {
    return this.memberService.remove(tenantId, companyId, userId);
  }
}