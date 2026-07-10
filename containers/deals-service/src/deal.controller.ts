// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — Controller
// ══════════════════════════════════════════════════

import { Controller, Get, Post, Put, Body, Param, Headers, Req, UseGuards, SetMetadata, NotFoundException } from '@nestjs/common';
import { DealService } from './deal.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller()
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post()
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async create(
    @Headers('tenant-id') tenantId: string,
    @Headers('user-id') userId: string,
    @Body() body: { listingId: string; offerPrice?: number; message?: string },
    @Req() req: any,
  ) {
    const buyerId = userId || req.userId || req.user?.userId;

    const listing = await this.dealService.getListing(tenantId, body.listingId);
    if (!listing) throw new NotFoundException('Listing not found');

    const sellerId = listing.owner_id;

    return this.dealService.create(tenantId, {
      listingId: body.listingId,
      buyerId,
      sellerId,
      offerPrice: body.offerPrice,
      message: body.message,
    });
  }

  @Get(':id')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async get(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.dealService.getById(tenantId, id);
  }

  @Get()
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async listByUser(
    @Headers('tenant-id') tenantId: string,
    @Headers('user-id') userId: string,
    @Headers('user-role') userRole: string,
  ) {
    if (userRole === 'ADMIN' || userRole === 'PLATFORM_OWNER') {
      return this.dealService.listAll(tenantId);
    }
    return this.dealService.listByUser(tenantId, userId);
  }

  @Put(':id/transition')
  @Roles('SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async transition(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { toStatus: string; userId: string; note?: string },
  ) {
    return this.dealService.transition(tenantId, id, body.toStatus, body.userId, body.note);
  }

  @Get(':id/history')
  @Roles('USER', 'SELLER', 'ADMIN', 'PLATFORM_OWNER')
  async history(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.dealService.getHistory(tenantId, id);
  }
}