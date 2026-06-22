// ══════════════════════════════════════════════════
// WASITI 2027 — Company Service — Controller
// ══════════════════════════════════════════════════

import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async create(
    @Headers('tenant-id') tenantId: string,
    @Body() body: { name: string; type: string; ownerId: string },
  ) {
    return this.companyService.create(tenantId, body);
  }

  @Get(':id')
  async get(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.companyService.getById(tenantId, id);
  }

  @Get()
  async list(@Headers('tenant-id') tenantId: string) {
    return this.companyService.list(tenantId);
  }

  @Put(':id')
  async update(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.companyService.update(tenantId, id, body);
  }

  @Delete(':id')
  async delete(
    @Headers('tenant-id') tenantId: string,
    @Param('id') id: string,
  ) {
    return this.companyService.delete(tenantId, id);
  }
}