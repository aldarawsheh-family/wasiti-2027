import { Controller, Get, Post, Put, Delete, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantScopeGuard } from './common/guards/tenant-scope.guard';
import { SetMetadata } from '@nestjs/common';
import { Pool } from 'pg';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller()
@UseGuards(AuthGuard, TenantGuard, RolesGuard, TenantScopeGuard)
@Roles('SELLER', 'ADMIN', 'PLATFORM_OWNER')
export class CompanyController {
  private db: Pool;

  constructor(private readonly companyService: CompanyService) {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://wasity:wasity@postgres:5432/wasity',
    });
  }

  @Post()
  async create(
    @Headers('tenant-id') tenantId: string,
    @Body() body: { name: string; type: string; ownerId: string; tenant_type?: string },
  ) {
    return this.companyService.create(tenantId, body);
  }

  @Get('my-company')
  async getMyCompany(@Headers('user-id') userId: string) {
    const result = await this.db.query(
      'SELECT id, name, tenant_type FROM company.companies WHERE owner_id = $1 LIMIT 1',
      [userId],
    );
    return result.rows[0] || null;
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