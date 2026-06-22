// ══════════════════════════════════════════════════
// WASITI 2027 — Listings Service — Category Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CategoryService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async list(tenantId: string) {
    const result = await this.db.query(
      `SELECT c.*, 
              (SELECT COUNT(*) FROM listings l WHERE l.category_id = c.id AND l.status = 'ACTIVE') as listing_count
       FROM categories c
       WHERE c.tenant_id = $1 AND c.is_active = true
       ORDER BY c.sort_order`,
      [tenantId],
    );
    return result.rows;
  }

  async getAttributes(tenantId: string, categoryId: string) {
    const result = await this.db.query(
      'SELECT * FROM category_attributes WHERE category_id = $1 ORDER BY sort_order',
      [categoryId],
    );
    return result.rows;
  }
}