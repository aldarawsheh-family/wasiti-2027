import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class WalletService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async getOrCreateWallet(userId: string, tenantId: string) {
    const existing = await this.pool.query(
      `SELECT * FROM wallet.wallets WHERE user_id = $1 AND tenant_id = $2`,
      [userId, tenantId],
    );

    if (existing.rows.length > 0) {
      return this.attachBalance(existing.rows[0]);
    }

    const walletNumber = await this.generateUniqueWalletNumber();

    const created = await this.pool.query(
      `INSERT INTO wallet.wallets (wallet_number, user_id, tenant_id, currency, account_type, status) VALUES ($1, $2, $3, 'SYP', 'USER', 'ACTIVE') RETURNING *`,
      [walletNumber, userId, tenantId],
    );

    return this.attachBalance(created.rows[0]);
  }

  async getBalance(walletId: string): Promise<number> {
    const result = await this.pool.query(
      `SELECT COALESCE(SUM(CASE WHEN entry_type='CREDIT' THEN amount ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN entry_type='DEBIT' THEN amount ELSE 0 END), 0) AS balance FROM wallet.ledger_entries WHERE wallet_id = $1`,
      [walletId],
    );
    return parseFloat(result.rows[0].balance);
  }

  async getByWalletNumber(walletNumber: string) {
    const result = await this.pool.query(
      `SELECT * FROM wallet.wallets WHERE wallet_number = $1`,
      [walletNumber],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException("المحفظة غير موجودة");
    }
    return this.attachBalance(result.rows[0]);
  }

  async requestTransaction(
    userId: string,
    tenantId: string,
    type: string,
    amount: number,
    meta: any,
    idempotencyKey: string
  ) {
    const wallet = await this.getOrCreateWallet(userId, tenantId);

    const direction = type === 'DEPOSIT' ? 'CREDIT' : 'DEBIT';

    const existing = await this.pool.query(
      `SELECT 1 FROM wallet.transactions WHERE user_id = $1 AND meta->>'idempotencyKey' = $2`,
      [userId, idempotencyKey],
    );
    if (existing.rows.length > 0) {
      throw new Error("تم تقديم هذا الطلب مسبقاً");
    }

    const enrichedMeta = { ...meta, idempotencyKey };

    const result = await this.pool.query(
      `INSERT INTO wallet.transactions (user_id, wallet_id, type, direction, amount, status, meta)
       VALUES ($1, $2, $3, $4, $5, 'PENDING', $6) RETURNING *`,
      [userId, wallet.id, type, direction, amount, JSON.stringify(enrichedMeta)],
    );

    return { success: true, requestId: result.rows[0].id, status: 'PENDING' };
  }

  async reviewTransaction(transactionId: string, reviewerId: string, reviewerRole: string) {
    const result = await this.pool.query(
      `UPDATE wallet.transactions SET status = 'UNDER_REVIEW' WHERE id = $1 AND status = 'PENDING' RETURNING *`,
      [transactionId],
    );
    if (result.rows.length === 0) throw new Error("الطلب غير موجود أو ليس في حالة انتظار");

    await this.pool.query(
      `INSERT INTO wallet.audit_log (transaction_id, action, actor_id, actor_role) VALUES ($1, 'REVIEW', $2, $3)`,
      [transactionId, reviewerId, reviewerRole],
    );

    return { success: true, status: 'UNDER_REVIEW' };
  }

  async approveTransaction(transactionId: string, approverId: string, approverRole: string) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const tx = await client.query(
        `SELECT * FROM wallet.transactions WHERE id = $1 FOR UPDATE`,
        [transactionId],
      );
      if (tx.rows.length === 0) throw new Error("الطلب غير موجود");
      if (tx.rows[0].status !== 'PENDING' && tx.rows[0].status !== 'UNDER_REVIEW') throw new Error("الطلب ليس في حالة انتظار أو مراجعة");

      const t = tx.rows[0];
      const balanceBefore = await this.getBalance(t.wallet_id);

      if (t.direction === 'DEBIT' && balanceBefore < parseFloat(t.amount)) {
        throw new Error("رصيد غير كاف");
      }

      const balanceAfter = t.direction === 'CREDIT'
        ? balanceBefore + parseFloat(t.amount)
        : balanceBefore - parseFloat(t.amount);

      const operationId = require("uuid").v4();
      await client.query(
        `INSERT INTO wallet.ledger_entries (wallet_id, amount, entry_type, operation_type, operation_id, idempotency_key)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [t.wallet_id, t.amount, t.direction, t.type, operationId, "approve-" + transactionId],
      );

      await client.query(
        `UPDATE wallet.transactions SET status = 'APPROVED', balance_before = $1, balance_after = $2, approved_at = NOW(), approved_by = $3 WHERE id = $4`,
        [balanceBefore, balanceAfter, approverId, transactionId],
      );

      await client.query(
        `INSERT INTO wallet.audit_log (transaction_id, action, actor_id, actor_role) VALUES ($1, 'APPROVE', $2, $3)`,
        [transactionId, approverId, approverRole],
      );

      await client.query("COMMIT");
      return { success: true, balanceBefore, balanceAfter };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async rejectTransaction(transactionId: string, approverId: string, approverRole: string, reason: string) {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const tx = await client.query(
        `SELECT * FROM wallet.transactions WHERE id = $1 FOR UPDATE`,
        [transactionId],
      );
      if (tx.rows.length === 0) throw new Error("الطلب غير موجود");
      if (tx.rows[0].status !== 'PENDING' && tx.rows[0].status !== 'UNDER_REVIEW') throw new Error("الطلب ليس في حالة انتظار أو مراجعة");

      await client.query(
        `UPDATE wallet.transactions SET status = 'REJECTED', rejection_reason = $1 WHERE id = $2`,
        [reason, transactionId],
      );

      await client.query(
        `INSERT INTO wallet.audit_log (transaction_id, action, actor_id, actor_role) VALUES ($1, 'REJECT', $2, $3)`,
        [transactionId, approverId, approverRole],
      );

      await client.query("COMMIT");
      return { success: true, status: 'REJECTED' };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async cancelTransaction(transactionId: string, userId: string) {
    const result = await this.pool.query(
      `UPDATE wallet.transactions SET status = 'CANCELLED' WHERE id = $1 AND user_id = $2 AND status IN ('PENDING', 'UNDER_REVIEW') RETURNING *`,
      [transactionId, userId],
    );
    if (result.rows.length === 0) throw new Error("لا يمكن إلغاء هذا الطلب");

    await this.pool.query(
      `INSERT INTO wallet.audit_log (transaction_id, action, actor_id, actor_role) VALUES ($1, 'CANCEL', $2, 'USER')`,
      [transactionId, userId],
    );

    return { success: true, status: 'CANCELLED' };
  }

  async getRequests(status?: string) {
    const query = status
      ? `SELECT t.*, w.wallet_number, w.user_id as wallet_user_id FROM wallet.transactions t JOIN wallet.wallets w ON t.wallet_id = w.id WHERE t.status = $1 ORDER BY t.created_at DESC`
      : `SELECT t.*, w.wallet_number, w.user_id as wallet_user_id FROM wallet.transactions t JOIN wallet.wallets w ON t.wallet_id = w.id ORDER BY t.created_at DESC`;
    const params = status ? [status] : [];
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  private async attachBalance(wallet: any) {
    const balance = await this.getBalance(wallet.id);
    return { ...wallet, balance };
  }

  private async generateUniqueWalletNumber(): Promise<string> {
    const year = new Date().getFullYear();
    let attempts = 0;

    while (attempts < 5) {
      const random = Math.floor(10000000 + Math.random() * 90000000);
      const candidate = `WSY-${year}-${random}`;

      const check = await this.pool.query(
        `SELECT 1 FROM wallet.wallets WHERE wallet_number = $1`,
        [candidate],
      );

      if (check.rows.length === 0) {
        return candidate;
      }
      attempts++;
    }

    throw new Error("تعذر توليد رقم محفظة فريد بعد عدة محاولات");
  }
}