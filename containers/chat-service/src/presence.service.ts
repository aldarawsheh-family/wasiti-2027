// ══════════════════════════════════════════════════
// WASITI 2027 — Chat Service — Presence Service
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class PresenceService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async setOnline(userId: string, socketId: string): Promise<void> {
    await this.redis.hset('presence:online', userId, socketId);
    await this.redis.expire('presence:online', 86400);
  }

  async setOffline(userId: string): Promise<void> {
    await this.redis.hdel('presence:online', userId);
  }

  async isOnline(userId: string): Promise<boolean> {
    const exists = await this.redis.hexists('presence:online', userId);
    return exists === 1;
  }

  async getOnlineUsers(): Promise<string[]> {
    const users = await this.redis.hkeys('presence:online');
    return users;
  }
}