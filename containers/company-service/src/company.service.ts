// ══════════════════════════════════════════════════
// WASITI 2027 — Company Service — Service
// ══════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CompanyService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async create(tenantId: string, data: { name: string; type: string; ownerId: string }) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\u0621-\u064A]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const result = await this.db.query(
      `INSERT INTO companies (tenant_id, name, slug, type, owner_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tenantId, data.name, slug, data.type, data.ownerId],
    );

    return result.rows[0];
  }

  async getById(tenantId: string, id: string) {
    const result = await this.db.query(
      'SELECT * FROM companies WHERE tenant_id = $1 AND id = $2',
      [tenantId, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Company not found');
    }

    return result.rows[0];
  }

  async list(tenantId: string) {
    const result = await this.db.query(
      'SELECT * FROM companies WHERE tenant_id = $1 ORDER BY created_at DESC',
      [tenantId],
    );
    return result.rows;
  }

  async update(tenantId: string, id: string, data: any) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(JSON.stringify(data.description));
    }
    if (data.logoUrl !== undefined) {
      updates.push(`logo_url = $${paramIndex++}`);
      values.push(data.logoUrl);
    }
    if (data.website !== undefined) {
      updates.push(`website = $${paramIndex++}`);
      values.push(data.website);
    }
    if (data.phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(data.phone);
    }

    if (updates.length === 0) {
      return this.getById(tenantId, id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(tenantId, id);

    await this.db.query(
      `UPDATE companies SET ${updates.join(', ')}
       WHERE tenant_id = $${paramIndex++} AND id = $${paramIndex}`,
      values,
    );

    return this.getById(tenantId, id);
  }

  async delete(tenantId: string, id: string) {
    await this.db.query(
      'DELETE FROM companies WHERE tenant_id = $1 AND id = $2',
      [tenantId, id],
    );
    return { message: 'Company deleted' };
  }
}