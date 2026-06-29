// ══════════════════════════════════════════════════
// WASITI 2027 — Chat Service — Room Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class RoomService {
  private db: Pool;

  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://wasity:***@postgres:5432/wasity');
    dbUrl.searchParams.set('options', '-c search_path=chat,public');
    this.db = new Pool({ connectionString: dbUrl.toString() });
  }

  async create(tenantId: string, participants: string[], listingId?: string) {
    const result = await this.db.query(
      `INSERT INTO chat_rooms (tenant_id, participants, listing_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tenantId, participants, listingId || null],
    );
    return result.rows[0];
  }

  async findByParticipants(tenantId: string, userId1: string, userId2: string) {
    const result = await this.db.query(
      `SELECT * FROM chat_rooms
       WHERE tenant_id = $1
         AND participants @> ARRAY[$2, $3]::uuid[]
         AND is_active = true
       LIMIT 1`,
      [tenantId, userId1, userId2],
    );
    return result.rows[0] || null;
  }

  async getUserRooms(tenantId: string, userId: string) {
    const result = await this.db.query(
      `SELECT r.*, 
              (SELECT content FROM chat_messages WHERE room_id = r.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT COUNT(*) FROM chat_messages WHERE room_id = r.id AND sender_id != $2 AND is_read = false) as unread_count
       FROM chat_rooms r
       WHERE r.tenant_id = $1
         AND $2 = ANY(r.participants)
         AND r.is_active = true
       ORDER BY r.last_message_at DESC NULLS LAST`,
      [tenantId, userId],
    );
    return result.rows;
  }
}