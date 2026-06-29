// â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ
// WASITI 2027 â€” Company Service â€” Controller
// â•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گâ•گ

import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { SetMetadata } from '@nestjs/common';
const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller()
@UseGuards(AuthGuard, TenantGuard, RolesGuard)
@Roles('SELLER', 'ADMIN', 'PLATFORM_OWNER')
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
