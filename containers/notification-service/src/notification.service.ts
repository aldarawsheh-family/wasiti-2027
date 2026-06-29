import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Pool } from 'pg';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class NotificationService {
  private db: Pool;

  constructor(private eventEmitter: EventEmitter2) {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://wasity:***@postgres:5432/wasity');
    dbUrl.searchParams.set('options', '-c search_path=notification,public');
    this.db = new Pool({ connectionString: dbUrl.toString() });
  }

  async create(data: { userId: string; type: string; title: string; body: string; link?: string }) {
    const result = await this.db.query(
      'INSERT INTO notifications (user_id, tenant_id, type, title, body, link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.userId, '00000000-0000-0000-0000-000000000001', data.type, JSON.stringify({ ar: data.title }), JSON.stringify({ ar: data.body }), data.link || null],
    );
    const notification = result.rows[0];
    this.eventEmitter.emit('notification.created', notification);
    return notification;
  }

  @OnEvent('listing.status.changed')
  async handleListingStatusChange(event: any) {
    const payload = event.payload || event;
    console.log('Notification: Listing status changed', payload.listingId, payload.to);
    await this.create({
      userId: payload.ownerId || 'system',
      type: 'LISTING_STATUS_CHANGED',
      title: 'تحديث حالة الإعلان',
      body: `تم تغيير حالة إعلانك إلى "${payload.to}"`,
      link: `/listings/${payload.listingId}`,
    });
  }

  @OnEvent('deal.created')
  async handleDealCreated(event: any) {
    const payload = event.payload || event;
    console.log('Notification: Deal created', payload.dealId);
    if (payload.sellerId) {
      await this.create({ userId: payload.sellerId, type: 'DEAL_CREATED', title: 'عرض جديد على إعلانك', body: 'لديك عرض جديد', link: `/deals/${payload.dealId}` });
    }
    if (payload.buyerId) {
      await this.create({ userId: payload.buyerId, type: 'DEAL_CREATED', title: 'تم إرسال عرضك', body: 'تم إرسال عرضك بنجاح', link: `/deals/${payload.dealId}` });
    }
  }

  @OnEvent('deal.completed')
  async handleDealCompleted(event: any) {
    const payload = event.payload || event;
    console.log('Notification: Deal completed', payload.dealId);
    if (payload.sellerId) {
      await this.create({ userId: payload.sellerId, type: 'DEAL_COMPLETED', title: 'تم بيع إعلانك', body: 'تم بيع إعلانك بنجاح', link: `/deals/${payload.dealId}` });
    }
    if (payload.buyerId) {
      await this.create({ userId: payload.buyerId, type: 'DEAL_COMPLETED', title: 'تمت الصفقة', body: 'تم إكمال الصفقة بنجاح', link: `/deals/${payload.dealId}` });
    }
  }

  async findAll(userId: string) {
    const result = await this.db.query('SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50', [userId]);
    return result.rows;
  }

  async findOne(id: string) {
    const result = await this.db.query('SELECT * FROM notifications WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    return result.rows[0];
  }

  async markRead(id: string) {
    const result = await this.db.query("UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
  }

  async markAllRead(userId: string) {
    await this.db.query("UPDATE notifications SET is_read = true, read_at = NOW() WHERE user_id = $1 AND is_read = false", [userId]);
    return { message: 'All notifications marked as read' };
  }

  async remove(id: string) {
    await this.db.query('DELETE FROM notifications WHERE id = $1', [id]);
    return { message: 'Notification deleted' };
  }
}