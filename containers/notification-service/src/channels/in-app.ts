// ══════════════════════════════════════════════════
// WASITI 2027 — Notification Service — In-App Channel
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class InAppChannel {
  async send(db: Pool, tenantId: string, notification: any) {
    await db.query(
      `INSERT INTO notifications (tenant_id, user_id, type, title, body, link, icon)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        tenantId,
        notification.userId,
        notification.type,
        JSON.stringify(notification.title),
        JSON.stringify(notification.body || {}),
        notification.link || null,
        notification.icon || null,
      ],
    );
  }
}