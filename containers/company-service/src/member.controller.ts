// â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
// WASITI 2027 â€” Company Service â€” Member Controller
// â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ

import { Controller, Get, Post, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller(':companyId/members')
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
@Roles('SELLER', 'ADMIN', 'PLATFORM_OWNER')
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
