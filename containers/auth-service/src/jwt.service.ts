// ══════════════════════════════════════════════════
// WASITI 2027 — Auth Service — JWT Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

interface JwtPayload {
  userId: string;
  tenantId: string;
  role: string;
  exp: number;
  iat: number;
}

@Injectable()
export class JwtService {
  private readonly secret: string;
  private readonly refreshSecret: string;
  private readonly accessExpires: string;
  private readonly refreshExpires: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'dev-secret';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';
    this.accessExpires = process.env.JWT_ACCESS_EXPIRES || '15m';
    this.refreshExpires = process.env.JWT_REFRESH_EXPIRES || '7d';
  }

  private parseExpires(expires: string): number {
    const match = expires.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // 15 دقيقة افتراضي

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 900;
    }
  }

  private base64UrlEncode(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  private sign(payload: object, secret: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerEncoded = this.base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = this.base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  private verify(token: string, secret: string): JwtPayload {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${parts[0]}.${parts[1]}`)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    if (signature !== parts[2]) throw new Error('Invalid signature');

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    return payload;
  }

  async generateTokens(userId: string, tenantId: string, role: string) {
    const now = Math.floor(Date.now() / 1000);
    const accessTtl = this.parseExpires(this.accessExpires);
    const refreshTtl = this.parseExpires(this.refreshExpires);

    const accessToken = this.sign(
      { userId, tenantId, role, iat: now, exp: now + accessTtl },
      this.secret,
    );

    const refreshToken = this.sign(
      { userId, tenantId, role: 'refresh', iat: now, exp: now + refreshTtl },
      this.refreshSecret,
    );

    return { accessToken, refreshToken, expiresIn: accessTtl };
  }

  async verifyAccess(token: string): Promise<JwtPayload> {
    return this.verify(token, this.secret);
  }

  async verifyRefresh(token: string): Promise<JwtPayload> {
    return this.verify(token, this.refreshSecret);
  }
}