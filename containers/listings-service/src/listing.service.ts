import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import Redis from 'ioredis';
import { transition } from './status-machine';
import { EventBus } from './event-bus';
import { EventStore } from './event-store';

@Injectable()
export class ListingService {
  private db: Pool;
  private redis: Redis;

  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore,
  ) {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://wasity:***@postgres:5432/wasity');
    dbUrl.searchParams.set('options', '-c search_path=listing,public');
    this.db = new Pool({ connectionString: dbUrl.toString() });
    this.redis = new Redis({ host: process.env.REDIS_URL?.split('//')[1]?.split(':')[0] || 'redis', port: 6379 });
  }

  async getAll(tenantId: string, limit: number = 50, offset: number = 0) {
    const cacheKey = `listings:${tenantId}:${limit}:${offset}`;
    
    // جرب من Redis أولاً
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch (err: any) {
      console.log('Redis cache miss:', err.message);
    }
    
    // لو مش موجود - من PostgreSQL
    const result = await this.db.query(
      'SELECT * FROM listings WHERE tenant_id = $1 AND status = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4',
      [tenantId, 'ACTIVE', limit, offset],
    );
    
    // خزن في Redis لمدة 5 دقائق
    try {
      await this.redis.setex(cacheKey, 300, JSON.stringify(result.rows));
    } catch (err: any) {
      console.log('Redis cache set failed:', err.message);
    }
    
    return result.rows;
  }

  async create(tenantId: string, data: any) {
    if (!data.ownerId) throw new Error('ownerId is required');
    const result = await this.db.query(
      'INSERT INTO listings (tenant_id, owner_id, company_id, category_id, title, description, price, city, status, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [tenantId, data.ownerId, data.companyId || null, data.categoryId || null, data.title || '', data.description || '', data.price || 0, data.city || '', data.status || 'ACTIVE', data.image || null],
    );
    // امسح الكاش عشان البيانات الجديدة تظهر
    try { await this.redis.del(`listings:${tenantId}:*`); } catch {}
    return result.rows[0];
  }

  async getById(tenantId: string, id: string) {
    const result = await this.db.query(
      'SELECT * FROM listings WHERE tenant_id = $1 AND id = $2',
      [tenantId, id],
    );
    if (result.rows.length === 0) throw new NotFoundException('Listing not found');
    return result.rows[0];
  }

  async update(tenantId: string, id: string, data: any) {
    const current = await this.getById(tenantId, id);
    
    if (data.status) {
      transition(current.status, data.status);
      this.eventBus.emit('listing.status.changed', { 
        listingId: id, from: current.status, to: data.status, 
        tenantId, ownerId: current.owner_id 
      });
      // حفظ في Event Store
      this.eventStore.save('listing.status.changed', { 
        listingId: id, from: current.status, to: data.status, 
        tenantId, ownerId: current.owner_id 
      });
    }

    if (data.status === 'RESERVED' && data.buyerId) {
      try {
        const dealResponse = await fetch('http://wasity-deals:3007/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'tenant-id': tenantId },
          body: JSON.stringify({
            listingId: id, buyerId: data.buyerId, sellerId: current.owner_id,
            offerPrice: data.price || current.price, message: data.message || 'تم الحجز من الإعلان'
          }),
        });
        const deal: any = await dealResponse.json();
        this.eventBus.emit('deal.created', { 
          dealId: deal?.id || id, listingId: id, buyerId: data.buyerId, sellerId: current.owner_id 
        });
        // حفظ في Event Store
        this.eventStore.save('deal.created', { 
          dealId: deal?.id || id, listingId: id, buyerId: data.buyerId, sellerId: current.owner_id 
        });
      } catch (err: any) { console.log('Failed to create deal:', err.message); }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    if (data.title !== undefined) { updates.push(`title = $${paramIndex++}`); values.push(data.title); }
    if (data.description !== undefined) { updates.push(`description = $${paramIndex++}`); values.push(data.description); }
    if (data.price !== undefined) { updates.push(`price = $${paramIndex++}`); values.push(data.price); }
    if (data.city !== undefined) { updates.push(`city = $${paramIndex++}`); values.push(data.city); }
    if (data.status !== undefined) { updates.push(`status = $${paramIndex++}`); values.push(data.status); }

    if (updates.length === 0) return current;
    updates.push(`updated_at = NOW()`);
    values.push(tenantId, id);

    await this.db.query(
      `UPDATE listings SET ${updates.join(', ')} WHERE tenant_id = $${paramIndex++} AND id = $${paramIndex}`,
      values,
    );
    // امسح الكاش
    try { await this.redis.del(`listings:${tenantId}:*`); } catch {}
    return this.getById(tenantId, id);
  }

  async delete(tenantId: string, id: string) {
    await this.db.query('UPDATE listings SET status = $1 WHERE tenant_id = $2 AND id = $3', ['DELETED', tenantId, id]);
    try { await this.redis.del(`listings:${tenantId}:*`); } catch {}
    return { message: 'Listing deleted' };
  }
}