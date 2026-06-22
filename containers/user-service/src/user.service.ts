// ══════════════════════════════════════════════════
// WASITI 2027 — User Service — Service
// ══════════════════════════════════════════════════

import { Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UserService {
  private db: Pool;

  constructor() {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
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

  async updateUser(tenantId: string, userId: string, data: any) {
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

  async getTrustScore(tenantId: string, userId: string) {
    const result = await this.db.query(
      `SELECT trust_score, is_verified,
              (SELECT COUNT(*) FROM reviews WHERE reviewed_id = $1) as total_reviews,
              (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE reviewed_id = $1) as avg_rating
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