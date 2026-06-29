import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { RedisService } from './redis.service';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private db: Pool;

  constructor(
    private readonly jwtService: JwtService,
    private readonly redis: RedisService,
  ) {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://wasity:***@postgres:5432/wasity');
    dbUrl.searchParams.set('options', '-c search_path=auth,public');
    this.db = new Pool({ connectionString: dbUrl.toString() });
  }

  async register(tenantId: string, body: { email: string; password: string; displayName?: string }) {
    const existing = await this.db.query(
      'SELECT id FROM users WHERE tenant_id = $1 AND email = $2',
      [tenantId, body.email],
    );

    if (existing.rows.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(body.password, 12);

    const result = await this.db.query(
      'INSERT INTO users (tenant_id, email, password_hash, display_name) VALUES ($1, $2, $3, $4) RETURNING id, email, display_name, role',
      [tenantId, body.email, passwordHash, body.displayName || body.email],
    );

    const user = result.rows[0];
    const tokens = await this.jwtService.generateTokens(user.id, tenantId, user.role);

    return {
      user: { id: user.id, email: user.email, displayName: user.display_name, role: user.role },
      ...tokens,
    };
  }

  async login(tenantId: string, email: string, password: string) {
    const result = await this.db.query(
      'SELECT * FROM users WHERE tenant_id = $1 AND email = $2 AND is_banned = false',
      [tenantId, email],
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    const tokens = await this.jwtService.generateTokens(user.id, tenantId, user.role);

    await this.redis.set('session:' + user.id, JSON.stringify({ tenantId, role: user.role }), 86400);

    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        role: user.role,
        trustScore: user.trust_score,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const isRotated = await this.redis.get('blacklist:' + refreshToken);
    if (isRotated) {
      throw new UnauthorizedException('Refresh token already used');
    }

    try {
      const payload = await this.jwtService.verifyRefresh(refreshToken);
      
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await this.redis.set('blacklist:' + refreshToken, 'rotated', ttl);
      }
      
      const tokens = await this.jwtService.generateTokens(payload.userId, payload.tenantId, payload.role);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(accessToken: string) {
    const payload = await this.jwtService.verifyAccess(accessToken).catch(() => null);
    if (payload) {
      const ttl = payload.exp - Math.floor(Date.now() / 1000);
      if (ttl > 0) {
        await this.redis.set('blacklist:' + accessToken, '1', ttl);
      }
    }
  }
}