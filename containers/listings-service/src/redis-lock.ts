import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisLock {
  private redis: Redis;
  private readonly LOCK_TTL = 10; // 10 ثواني

  constructor() {
    this.redis = new Redis({ host: process.env.REDIS_URL?.split('//')[1]?.split(':')[0] || 'redis', port: 6379 });
  }

  async acquire(key: string): Promise<string | null> {
    const lockKey = `lock:${key}`;
    const lockValue = Date.now().toString() + Math.random().toString();
    
    // SET NX = فقط لو مش موجود
    const result = await this.redis.set(lockKey, lockValue, 'EX', this.LOCK_TTL, 'NX');
    
    if (result === 'OK') {
      return lockValue;
    }
    return null;
  }

  async release(key: string, lockValue: string): Promise<void> {
    const lockKey = `lock:${key}`;
    
    // نتأكد إن القفل لسه بتاعنا قبل ما نمسحه
    const current = await this.redis.get(lockKey);
    if (current === lockValue) {
      await this.redis.del(lockKey);
    }
  }

  async withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const lockValue = await this.acquire(key);
    
    if (!lockValue) {
      throw new Error(`Could not acquire lock for: ${key}`);
    }

    try {
      return await fn();
    } finally {
      await this.release(key, lockValue);
    }
  }
}
