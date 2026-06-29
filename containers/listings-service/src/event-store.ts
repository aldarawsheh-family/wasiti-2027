import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class EventStore {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({ host: 'redis', port: 6379 });
  }

  async save(event: string, data: any) {
    const id = `${event}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    await this.redis.hset('event_store', id, JSON.stringify({ event, data, timestamp: new Date() }));
    return id;
  }

  async getAll(event?: string) {
    const all = await this.redis.hgetall('event_store');
    return Object.entries(all)
      .filter(([key]) => !event || key.startsWith(event))
      .map(([key, value]) => ({ id: key, ...JSON.parse(value) }));
  }

  async replay(event: string) {
    const events = await this.getAll(event);
    console.log(`🔄 Replaying ${events.length} events of type: ${event}`);
    return events;
  }
}
