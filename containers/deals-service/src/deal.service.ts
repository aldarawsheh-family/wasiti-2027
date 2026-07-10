// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — Service
// ══════════════════════════════════════════════════

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Pool } from 'pg';
import { StateMachine } from './state-machine';
import { AuditService } from './audit.service';

@Injectable()
export class DealService {
  private db: Pool;

  constructor(
    private readonly stateMachine: StateMachine,
    private readonly audit: AuditService,
  ) {
    const dbUrl = new URL(process.env.DATABASE_URL || 'postgres://wasity:***@postgres:5432/wasity');
    dbUrl.searchParams.set('options', '-c search_path=deal,public');
    this.db = new Pool({ connectionString: dbUrl.toString() });
  }
  async getListing(tenantId: string, listingId: string) {
    const result = await this.db.query(
      `SELECT * FROM listing.listings WHERE tenant_id = $1 AND id = $2`,
      [tenantId, listingId],
    );
    return result.rows[0] || null;
  }
  async create(tenantId: string, data: any) {
    const result = await this.db.query(
      `INSERT INTO deals (tenant_id, listing_id, buyer_id, seller_id, offer_price, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'PENDING')
       RETURNING *`,
      [tenantId, data.listingId, data.buyerId, data.sellerId, data.offerPrice || null, data.message || null],
    );

    await this.audit.log(tenantId, result.rows[0].id, null, 'PENDING', data.buyerId, 'Deal created');

    return result.rows[0];
  }

  async getById(tenantId: string, id: string) {
    const result = await this.db.query(
      `SELECT d.*, l.title as listing_title
       FROM deals d
       JOIN listing.listings l ON d.listing_id = l.id
       WHERE d.tenant_id = $1 AND d.id = $2`,
      [tenantId, id],
    );

    if (result.rows.length === 0) throw new NotFoundException('Deal not found');
    return result.rows[0];
  }

  async listByUser(tenantId: string, userId: string) {
    const result = await this.db.query(
      `SELECT d.*, l.title as listing_title
       FROM deals d
       JOIN listing.listings l ON d.listing_id = l.id
       WHERE d.tenant_id = $1 AND (d.buyer_id = $2 OR d.seller_id = $2)
       ORDER BY d.updated_at DESC`,
      [tenantId, userId],
    );
    return result.rows;
  }

  async listAll(tenantId: string) {
    const result = await this.db.query(
      `SELECT d.*, l.title as listing_title
       FROM deals d
       LEFT JOIN listing.listings l ON d.listing_id = l.id
       WHERE d.tenant_id = $1
       ORDER BY d.created_at DESC`,
      [tenantId],
    );
    return result.rows;
  }

  async transition(tenantId: string, id: string, toStatus: string, userId: string, note?: string) {
    const deal = await this.getById(tenantId, id);
    const fromStatus = deal.status;

    if (!this.stateMachine.canTransition(fromStatus, toStatus, deal, userId)) {
      throw new BadRequestException(`Cannot transition from ${fromStatus} to ${toStatus}`);
    }

    const updates: any = { status: toStatus };
    if (toStatus === 'COMPLETED') updates.completed_at = new Date();
    if (toStatus === 'CANCELLED') {
      updates.cancelled_at = new Date();
      updates.cancelled_by = userId;
    }

    await this.db.query(
      `UPDATE deals SET status = $1, updated_at = NOW()
       WHERE tenant_id = $2 AND id = $3`,
      [toStatus, tenantId, id],
    );

    await this.audit.log(tenantId, id, fromStatus, toStatus, userId, note || '');

    return this.getById(tenantId, id);
  }

  async getHistory(tenantId: string, dealId: string) {
    const result = await this.db.query(
      `SELECT dt.*, u.display_name as changed_by_name
       FROM deal_transitions dt
       JOIN public.users u ON dt.changed_by = u.id
       WHERE dt.deal_id = $1
       ORDER BY dt.created_at ASC`,
      [dealId],
    );
    return result.rows;
  }
}