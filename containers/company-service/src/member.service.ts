// ══════════════════════════════════════════════════
// WASITI 2027 — Company Service — Member Service
// ══════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class MemberService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async add(tenantId: string, companyId: string, userId: string, role: string = 'MEMBER') {
    // التحقق من وجود الشركة
    const company = await this.db.query(
      'SELECT id FROM companies WHERE tenant_id = $1 AND id = $2',
      [tenantId, companyId],
    );
    if (company.rows.length === 0) throw new NotFoundException('Company not found');

    const result = await this.db.query(
      `INSERT INTO company_members (company_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (company_id, user_id) DO UPDATE SET role = $3
       RETURNING *`,
      [companyId, userId, role],
    );
    return result.rows[0];
  }

  async list(tenantId: string, companyId: string) {
    const result = await this.db.query(
      `SELECT cm.*, u.display_name, u.email, u.avatar_url
       FROM company_members cm
       JOIN users u ON cm.user_id = u.id
       WHERE cm.company_id = $1
       ORDER BY cm.joined_at DESC`,
      [companyId],
    );
    return result.rows;
  }

  async remove(tenantId: string, companyId: string, userId: string) {
    await this.db.query(
      'DELETE FROM company_members WHERE company_id = $1 AND user_id = $2',
      [companyId, userId],
    );
    return { message: 'Member removed' };
  }
}