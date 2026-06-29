// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — Search Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class SearchService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async search(tenantId: string, params: any) {
    const conditions: string[] = ['l.tenant_id = $1'];
    const values: any[] = [tenantId];
    let paramIndex = 2;

    // البحث النصي
    if (params.q) {
      conditions.push(`l.title::text ILIKE $${paramIndex}`);
      values.push(`%${params.q}%`);
      paramIndex++;
    }

    // الفئة
    if (params.category) {
      conditions.push(`l.category_id = $${paramIndex}`);
      values.push(params.category);
      paramIndex++;
    }

    // المدينة
    if (params.city) {
      conditions.push(`l.city::text ILIKE $${paramIndex}`);
      values.push(`%${params.city}%`);
      paramIndex++;
    }

    // نطاق السعر
    if (params.minPrice) {
      conditions.push(`l.price >= $${paramIndex}`);
      values.push(parseFloat(params.minPrice));
      paramIndex++;
    }
    if (params.maxPrice) {
      conditions.push(`l.price <= $${paramIndex}`);
      values.push(parseFloat(params.maxPrice));
      paramIndex++;
    }

    // الحالة
    conditions.push(`l.status = 'ACTIVE'`);

    const limit = Math.min(parseInt(params.limit) || 20, 100);
    const offset = parseInt(params.offset) || 0;

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM listings l WHERE ${whereClause}`,
      values,
    );

    values.push(limit, offset);
    const result = await this.db.query(
      `SELECT l.*, 
              u.display_name as owner_name,
              c.name as company_name
       FROM listings l
       LEFT JOIN users u ON l.owner_id = u.id
       LEFT JOIN companies c ON l.company_id = c.id
       WHERE ${whereClause}
       ORDER BY l.is_featured DESC, l.created_at DESC
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      values,
    );

    return {
      items: result.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    };
  }
}