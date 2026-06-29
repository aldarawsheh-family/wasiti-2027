// ══════════════════════════════════════════════════
// WASITI 2027 — Chat Service — Message Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class MessageService {
  private db: Pool;

  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://wasity:***@postgres:5432/wasity');
    dbUrl.searchParams.set('options', '-c search_path=chat,public');
    this.db = new Pool({ connectionString: dbUrl.toString() });
  }

  async save(tenantId: string, roomId: string, senderId: string, content: string, type: string = 'text') {
    const result = await this.db.query(
      `INSERT INTO chat_messages (room_id, sender_id, content, type)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [roomId, senderId, content, type],
    );

    await this.db.query(
      'UPDATE chat_rooms SET last_message_at = NOW(), updated_at = NOW() WHERE id = $1',
      [roomId],
    );

    return result.rows[0];
  }

  async getMessages(roomId: string, limit: number = 50, offset: number = 0) {
    const result = await this.db.query(
      `SELECT m.*, u.display_name as sender_name, u.avatar_url as sender_avatar
       FROM chat_messages m
       JOIN auth.users u ON m.sender_id = u.id
       WHERE m.room_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2 OFFSET $3`,
      [roomId, limit, offset],
    );
    return result.rows.reverse();
  }

  async markAsRead(messageId: string, userId: string) {
    await this.db.query(
      'UPDATE chat_messages SET is_read = true, read_at = NOW() WHERE id = $1 AND sender_id != $2',
      [messageId, userId],
    );
  }
}