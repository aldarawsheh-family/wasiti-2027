import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class AuditService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async log(entity: string, entityId: string, action: string, userId: string, details: any = {}) {
    await this.db.query(
      `INSERT INTO audit_logs (entity, entity_id, action, user_id, details) VALUES ($1, $2, $3, $4, $5)`,
      [entity, entityId, action, userId, JSON.stringify(details)],
    );
  }
}
