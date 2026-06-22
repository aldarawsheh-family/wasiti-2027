// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — Audit Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AuditService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async log(
    tenantId: string,
    dealId: string,
    fromStatus: string | null,
    toStatus: string,
    userId: string,
    note: string,
  ) {
    await this.db.query(
      `INSERT INTO deal_transitions (deal_id, from_status, to_status, changed_by, note)
       VALUES ($1, $2, $3, $4, $5)`,
      [dealId, fromStatus, toStatus, userId, note],
    );
  }
}