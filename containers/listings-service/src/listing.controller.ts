// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — Controller
// ══════════════════════════════════════════════════

import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ListingService } from './listing.service';
import { SearchService } from './search.service';

@Controller()
export class ListingController {
  constructor(
    private readonly listingService: ListingService,
    private readonly searchService: SearchService,
  ) {}

  @Post()
  async create(
    @Headers('tenant-id') tenantId: string,
    @Body() body: any,
  ) {
    return this.listingService.create(tenantId, body);
  }

  @Get('search')
  async search(
    @Headers('tenant-id') tenantId: string,
    @Query('q') q: string,
    @Query('category') category: string,
    @Query('city') city: string,
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return this.searchService.search(tenantId, {
      q, category, city, minPrice, maxPrice, limit, offset,
    });
  }

  @Get(':id')
  async get(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.listingService.getById(tenantId, id);
  }

  @Put(':id')
  async update(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.listingService.update(tenantId, id, body);
  }

  @Delete(':id')
  async delete(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.listingService.delete(tenantId, id);
  }
}