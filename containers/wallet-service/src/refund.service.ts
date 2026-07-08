import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class RefundService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async createRequest(params: {
    walletId: string;
    referenceType: string;
    referenceId: string;
    amount: number;
    reason: string;
    requestedBy: string;
    idempotencyKey: string;
  }) {
    const { walletId, referenceType, referenceId, amount, reason, requestedBy, idempotencyKey } = params;

    const existing = await this.pool.query(
      "SELECT * FROM wallet.refund_requests WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await this.pool.query(
      `INSERT INTO wallet.refund_requests
       (wallet_id, reference_type, reference_id, amount, reason, requested_by, idempotency_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [walletId, referenceType, referenceId, amount, reason, requestedBy, idempotencyKey]
    );

    return result.rows[0];
  }

  async approve(params: {
    refundId: string;
    adminUserId: string;
    decision: "APPROVE" | "REJECT";
    note?: string;
  }) {
    const { refundId, adminUserId, decision, note } = params;

    const request = await this.pool.query(
      "SELECT * FROM wallet.refund_requests WHERE id = $1",
      [refundId]
    );
    if (!request.rows.length) {
      throw new BadRequestException("طلب الاسترجاع غير موجود");
    }
    if (request.rows[0].status !== "PENDING") {
      throw new BadRequestException("لا يمكن الموافقة على طلب بحالة " + request.rows[0].status);
    }

    const result = await this.pool.query(
      `INSERT INTO wallet.refund_approvals
       (refund_id, approved_by, decision, note)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [refundId, adminUserId, decision, note]
    );

    const newStatus = decision === "APPROVE" ? "APPROVED" : "REJECTED";
    await this.pool.query(
      "UPDATE wallet.refund_requests SET status = $1 WHERE id = $2",
      [newStatus, refundId]
    );

    return result.rows[0];
  }

  async execute(refundId: string, sourceWalletId: string) {
    const request = await this.pool.query(
      "SELECT * FROM wallet.refund_requests WHERE id = $1",
      [refundId]
    );
    if (!request.rows.length) {
      throw new BadRequestException("طلب الاسترجاع غير موجود");
    }
    if (request.rows[0].status !== "APPROVED") {
      throw new BadRequestException("لا يمكن تنفيذ طلب بحالة " + request.rows[0].status);
    }

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const operationId = uuidv4();

      // DEBIT من مصدر الأموال
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'DEBIT', $2, $3, 'REFUND', $4, $5)`,
        [sourceWalletId, request.rows[0].amount, operationId, request.rows[0].idempotency_key, "استرجاع مبلغ"]
      );

      // CREDIT لمحفظة المستخدم
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'CREDIT', $2, $3, 'REFUND', $4, $5)`,
        [request.rows[0].wallet_id, request.rows[0].amount, operationId, request.rows[0].idempotency_key, "استلام مبلغ مرتجع"]
      );

      // سجل التنفيذ
      await client.query(
        `INSERT INTO wallet.refund_executions
         (refund_id, ledger_operation_id, source_wallet_id)
         VALUES ($1, $2, $3)`,
        [refundId, operationId, sourceWalletId]
      );

      // تحديث الحالة
      await client.query(
        "UPDATE wallet.refund_requests SET status = 'EXECUTED' WHERE id = $1",
        [refundId]
      );

      await client.query("COMMIT");
      return { status: "EXECUTED", operationId };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}
