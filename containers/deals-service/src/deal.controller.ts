// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — Controller
// ══════════════════════════════════════════════════

import { Controller, Get, Post, Put, Body, Param, Headers } from '@nestjs/common';
import { DealService } from './deal.service';

@Controller()
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post()
  async create(
    @Headers('tenant-id') tenantId: string,
    @Body() body: { listingId: string; buyerId: string; sellerId: string; offerPrice?: number; message?: string },
  ) {
    return this.dealService.create(tenantId, body);
  }

  @Get(':id')
  async get(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.dealService.getById(tenantId, id);
  }

  @Get()
  async list(
    @Headers('tenant-id') tenantId: string,
    @Headers('user-id') userId: string,
  ) {
    return this.dealService.listByUser(tenantId, userId);
  }

  @Put(':id/transition')
  async transition(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { toStatus: string; userId: string; note?: string },
  ) {
    return this.dealService.transition(tenantId, id, body.toStatus, body.userId, body.note);
  }

  @Get(':id/history')
  async history(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.dealService.getHistory(tenantId, id);
  }
}