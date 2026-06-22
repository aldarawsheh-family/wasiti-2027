// ══════════════════════════════════════════════════
// WASITI 2027 — Notification Service — Feed Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class FeedService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getFeed(userId: string, limit: number = 20) {
    const result = await this.db.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit],
    );
    return result.rows;
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.db.query(
      `UPDATE notifications SET is_read = true, read_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [notificationId, userId],
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    const result = await this.db.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId],
    );
    return parseInt(result.rows[0].count);
  }
}