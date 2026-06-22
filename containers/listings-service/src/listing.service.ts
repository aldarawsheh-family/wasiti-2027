// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — Service
// ══════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ListingService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async create(tenantId: string, data: any) {
    const result = await this.db.query(
      `INSERT INTO listings (tenant_id, owner_id, company_id, category_id, title, description, price, currency, price_type, city, district, address, metadata, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        tenantId,
        data.ownerId,
        data.companyId || null,
        data.categoryId || null,
        JSON.stringify(data.title),
        JSON.stringify(data.description || {}),
        data.price,
        data.currency || 'LYD',
        data.priceType || 'FIXED',
        JSON.stringify(data.city || {}),
        JSON.stringify(data.district || {}),
        JSON.stringify(data.address || {}),
        JSON.stringify(data.metadata || {}),
        data.status || 'ACTIVE',
      ],
    );

    return result.rows[0];
  }

  async getById(tenantId: string, id: string) {
    const result = await this.db.query(
      `SELECT l.*, 
              u.display_name as owner_name, u.avatar_url as owner_avatar,
              c.name as company_name
       FROM listings l
       LEFT JOIN users u ON l.owner_id = u.id
       LEFT JOIN companies c ON l.company_id = c.id
       WHERE l.tenant_id = $1 AND l.id = $2`,
      [tenantId, id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('Listing not found');
    }

    // زيادة عداد المشاهدات
    await this.db.query(
      'UPDATE listings SET view_count = view_count + 1 WHERE id = $1',
      [id],
    );

    return result.rows[0];
  }

  async update(tenantId: string, id: string, data: any) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(JSON.stringify(data.title));
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(JSON.stringify(data.description));
    }
    if (data.price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(data.price);
    }
    if (data.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(data.status);
    }
    if (data.metadata !== undefined) {
      updates.push(`metadata = $${paramIndex++}`);
      values.push(JSON.stringify(data.metadata));
    }

    if (updates.length === 0) {
      return this.getById(tenantId, id);
    }

    updates.push(`updated_at = NOW()`);
    values.push(tenantId, id);

    await this.db.query(
      `UPDATE listings SET ${updates.join(', ')}
       WHERE tenant_id = $${paramIndex++} AND id = $${paramIndex}`,
      values,
    );

    return this.getById(tenantId, id);
  }

  async delete(tenantId: string, id: string) {
    await this.db.query(
      'UPDATE listings SET status = $1, updated_at = NOW() WHERE tenant_id = $2 AND id = $3',
      ['DELETED', tenantId, id],
    );
    return { message: 'Listing deleted' };
  }
}