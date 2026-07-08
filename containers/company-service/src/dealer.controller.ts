import { Controller, Get, Post, Put, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantScopeGuard } from './common/guards/tenant-scope.guard';
import { SetMetadata } from '@nestjs/common';
import { Pool } from 'pg';

const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller('dealer')
@UseGuards(AuthGuard, TenantGuard, RolesGuard, TenantScopeGuard)
export class DealerController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgres://wasity:wasity@postgres:5432/wasity',
    });
  }

  @Get(':id/profile')
  async getProfile(@Param('id') id: string) {
    const result = await this.db.query(
      'SELECT * FROM company.dealer_profiles WHERE company_id = $1',
      [id],
    );
    return result.rows[0] || null;
  }

  @Post(':id/profile')
  async createProfile(@Param('id') id: string, @Body() body: any) {
    const result = await this.db.query(
      `INSERT INTO company.dealer_profiles (company_id, specialty, office_address, license_number)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, body.specialty, body.officeAddress, body.licenseNumber],
    );
    return result.rows[0];
  }

  @Get(':id/clients')
  async getClients(@Param('id') id: string) {
    const result = await this.db.query(
      `SELECT cc.*, u.email, u.display_name 
       FROM company.company_clients cc 
       JOIN auth.users u ON cc.user_id = u.id 
       WHERE cc.company_id = $1`,
      [id],
    );
    return result.rows;
  }

  @Post(':id/clients')
  async addClient(@Param('id') id: string, @Body() body: { userId: string; notes?: string }) {
    const result = await this.db.query(
      `INSERT INTO company.company_clients (company_id, user_id, notes)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, body.userId, body.notes || ''],
    );
    return result.rows[0];
  }
}