import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { EventPublisher } from "./event-publisher.service";

@Injectable()
export class EscrowService {
  constructor(
    private readonly eventPublisher: EventPublisher,
    @Inject("PG_POOL") private readonly pool: Pool) {}

  async holdFunds(params: {
    buyerWalletId: string;
    sellerWalletId: string;
    amount: number;
    currency: string;
    referenceType: string;
    referenceId: string;
    idempotencyKey: string;
  }) {
    const { buyerWalletId, sellerWalletId, amount, currency, referenceType, referenceId, idempotencyKey } = params;

    // 1. تحقق من idempotency
    const existing = await this.pool.query(
      "SELECT * FROM wallet.escrow_transactions WHERE idempotency_key = $1",
      [idempotencyKey]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    // 2. احصل على محفظة Escrow النظامية
    const escrowWallet = await this.pool.query(
      "SELECT id FROM wallet.wallets WHERE wallet_number = 'SYS-ESCROW-001'"
    );
    if (!escrowWallet.rows.length) {
      throw new BadRequestException("محفظة Escrow غير موجودة");
    }
    const escrowWalletId = escrowWallet.rows[0].id;

    // 3. ابدأ Transaction
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const operationId = uuidv4();

      // سجل في Ledger: DEBIT من المشتري
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'DEBIT', $2, $3, 'ESCROW', $4, $5)`,
        [buyerWalletId, amount, operationId, idempotencyKey, "حجز مبلغ في Escrow"]
      );

      // سجل في Ledger: CREDIT لمحفظة Escrow
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'CREDIT', $2, $3, 'ESCROW', $4, $5)`,
        [escrowWalletId, amount, operationId, idempotencyKey, "استلام مبلغ في Escrow"]
      );

      // أنشئ سجل Escrow
      const result = await client.query(
        `INSERT INTO wallet.escrow_transactions
         (buyer_wallet_id, seller_wallet_id, escrow_wallet_id, amount, currency, reference_type, reference_id, status, idempotency_key)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'HELD', $8)
         RETURNING *`,
        [buyerWalletId, sellerWalletId, escrowWalletId, amount, currency, referenceType, referenceId, idempotencyKey]
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async releaseToSeller(escrowId: string, actor: string) {
    const escrow = await this.pool.query(
      "SELECT * FROM wallet.escrow_transactions WHERE id = $1",
      [escrowId]
    );
    if (!escrow.rows.length) throw new BadRequestException("Escrow غير موجود");
    if (escrow.rows[0].status !== "HELD") {
      throw new BadRequestException("لا يمكن إطلاق Escrow في الحالة الحالية");
    }

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const operationId = uuidv4();

      // سجل في Ledger: DEBIT من Escrow
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'DEBIT', $2, $3, 'ESCROW_RELEASE', $4, $5)`,
        [escrow.rows[0].escrow_wallet_id, escrow.rows[0].amount, operationId, escrow.rows[0].idempotency_key, "إطلاق مبلغ من Escrow إلى البائع"]
      );

      // سجل في Ledger: CREDIT للبائع
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'CREDIT', $2, $3, 'ESCROW_RELEASE', $4, $5)`,
        [escrow.rows[0].seller_wallet_id, escrow.rows[0].amount, operationId, escrow.rows[0].idempotency_key, "استلام مبلغ من Escrow"]
      );

      // تحديث حالة Escrow
      await client.query(
        "UPDATE wallet.escrow_transactions SET status = 'RELEASED_TO_SELLER', resolved_at = NOW() WHERE id = $1",
        [escrowId]
      );

      // تسجيل transition
      await client.query(
        "INSERT INTO wallet.escrow_transitions (escrow_id, from_status, to_status, actor) VALUES ($1, 'HELD', 'RELEASED_TO_SELLER', $2)",
        [escrowId, actor]
      );

      await client.query("COMMIT");
      return { status: "RELEASED_TO_SELLER" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async refundToBuyer(escrowId: string, actor: string) {
    const escrow = await this.pool.query(
      "SELECT * FROM wallet.escrow_transactions WHERE id = $1",
      [escrowId]
    );
    if (!escrow.rows.length) throw new BadRequestException("Escrow غير موجود");
    if (escrow.rows[0].status !== "HELD") {
      throw new BadRequestException("لا يمكن استرجاع Escrow في الحالة الحالية");
    }

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");

      const operationId = uuidv4();

      // سجل في Ledger: DEBIT من Escrow
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'DEBIT', $2, $3, 'ESCROW_REFUND', $4, $5)`,
        [escrow.rows[0].escrow_wallet_id, escrow.rows[0].amount, operationId, escrow.rows[0].idempotency_key, "استرجاع مبلغ من Escrow إلى المشتري"]
      );

      // سجل في Ledger: CREDIT للمشتري
      await client.query(
        `INSERT INTO wallet.ledger_entries
         (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'CREDIT', $2, $3, 'ESCROW_REFUND', $4, $5)`,
        [escrow.rows[0].buyer_wallet_id, escrow.rows[0].amount, operationId, escrow.rows[0].idempotency_key, "استلام مبلغ مرتجع من Escrow"]
      );

      // تحديث حالة Escrow
      await client.query(
        "UPDATE wallet.escrow_transactions SET status = 'REFUNDED_TO_BUYER', resolved_at = NOW() WHERE id = $1",
        [escrowId]
      );

      // تسجيل transition
      await client.query(
        "INSERT INTO wallet.escrow_transitions (escrow_id, from_status, to_status, actor) VALUES ($1, 'HELD', 'REFUNDED_TO_BUYER', $2)",
        [escrowId, actor]
      );

      await client.query("COMMIT");
      return { status: "REFUNDED_TO_BUYER" };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async getByReference(referenceType: string, referenceId: string) {
    const result = await this.pool.query(
      "SELECT * FROM wallet.escrow_transactions WHERE reference_type = $1 AND reference_id = $2",
      [referenceType, referenceId]
    );
    return result.rows;
  }

  async getTransitions(escrowId: string) {
    const result = await this.pool.query(
      "SELECT * FROM wallet.escrow_transitions WHERE escrow_id = $1 ORDER BY created_at ASC",
      [escrowId]
    );
    return result.rows;
  }
}

