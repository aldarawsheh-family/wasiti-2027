// ══════════════════════════════════════════════════
// WASITI 2027 — User Service — Service
// ══════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UserService {
  private db: Pool;

  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://wasity:***@postgres:5432/wasity');
    dbUrl.searchParams.set('options', '-c search_path=auth,public');
    this.db = new Pool({ connectionString: dbUrl.toString() });
  }

  async getUsers(tenantId: string) {
    const result = await this.db.query(
      `SELECT id, email, phone, display_name, avatar_url, role, trust_score,
              is_verified, is_banned, created_at
       FROM users
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [tenantId],
    );

    return result.rows.map(user => ({
      id: user.id,
      email: user.email,
      phone: user.phone,
      display_name: user.display_name,
      avatar_url: user.avatar_url,
      role: user.role,
      trust_score: user.trust_score,
      is_verified: user.is_verified,
      is_banned: user.is_banned,
      created_at: user.created_at,
    }));
  }

  async getUser(tenantId: string, userId: string) {
    const result = await this.db.query(
      `SELECT id, email, phone, display_name, avatar_url, role, trust_score,
              is_verified, language, theme, last_login_at, created_at
       FROM users
       WHERE tenant_id = $1 AND id = $2 AND is_banned = false`,
      [tenantId, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    const user = result.rows[0];
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      role: user.role,
      trustScore: user.trust_score,
      isVerified: user.is_verified,
      language: user.language,
      theme: user.theme,
      lastLoginAt: user.last_login_at,
      createdAt: user.created_at,
    };
  }

  async updateUser(tenantId: string, userId: string, data: any, actorId?: string) {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.displayName !== undefined) {
      updates.push(`display_name = $${paramIndex++}`);
      values.push(data.displayName);
    }
    if (data.phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(data.phone);
    }
    if (data.language !== undefined) {
      updates.push(`language = $${paramIndex++}`);
      values.push(data.language);
    }
    if (data.theme !== undefined) {
      updates.push(`theme = $${paramIndex++}`);
      values.push(data.theme);
    }
    if (data.role !== undefined) {
      updates.push(`role = $${paramIndex++}`);
      values.push(data.role);
    }

    if (updates.length === 0) {
      return this.getUser(tenantId, userId);
    }

    updates.push(`updated_at = NOW()`);
    values.push(tenantId, userId);

    await this.db.query(
      `UPDATE users SET ${updates.join(', ')}
       WHERE tenant_id = $${paramIndex++} AND id = $${paramIndex}`,
      values,
    );

    return this.getUser(tenantId, userId);
  }

  async deleteUser(tenantId: string, userId: string, actorId?: string) {
    const result = await this.db.query(
      `UPDATE users SET is_banned = true, updated_at = NOW()
       WHERE tenant_id = $1 AND id = $2
       RETURNING id, email`,
      [tenantId, userId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted', user: result.rows[0] };
  }

  async getTrustScore(tenantId: string, userId: string) {
    const result = await this.db.query(
      `SELECT trust_score, is_verified,
              (SELECT COUNT(*) FROM listing.reviews WHERE reviewed_id = $1) as total_reviews,
              (SELECT COALESCE(AVG(rating), 0) FROM listing.reviews WHERE reviewed_id = $1) as avg_rating
       FROM users
       WHERE tenant_id = $2 AND id = $1`,
      [userId, tenantId],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException('User not found');
    }

    return result.rows[0];
  }
}