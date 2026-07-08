import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class CommissionService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}
  
  private readonly COMMISSION_RATE = 0.02; // 2%

  async deductCommission(params: {
    escrowWalletId: string; amount: number; sellerWalletId: string;
    idempotencyKey: string;
  }) {
    const commission = params.amount * this.COMMISSION_RATE;
    const sellerAmount = params.amount - commission;

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const opId = uuidv4();

      // DEBIT من Escrow - CREDIT للبائع (بعد العمولة)
      await client.query(
        `INSERT INTO wallet.ledger_entries (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'DEBIT', $2, $3, 'ESCROW_RELEASE', $4, 'إطلاق من Escrow بعد العمولة')`,
        [params.escrowWalletId, sellerAmount, opId, params.idempotencyKey]
      );
      await client.query(
        `INSERT INTO wallet.ledger_entries (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'CREDIT', $2, $3, 'ESCROW_RELEASE', $4, 'استلام مبلغ بعد خصم العمولة')`,
        [params.sellerWalletId, sellerAmount, opId, params.idempotencyKey]
      );

      // العمولة تروح لمحفظة SYS-COMMISSIONS
      const sysWallet = await client.query("SELECT id FROM wallet.wallets WHERE wallet_number = 'SYS-COMMISSIONS'");
      if (sysWallet.rows.length) {
        await client.query(
          `INSERT INTO wallet.ledger_entries (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
           VALUES ($1, 'DEBIT', $2, $3, 'ESCROW_RELEASE', $4, 'عمولة')`,
          [params.escrowWalletId, commission, opId, params.idempotencyKey]
        );
        await client.query(
          `INSERT INTO wallet.ledger_entries (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
           VALUES ($1, 'CREDIT', $2, $3, 'ESCROW_RELEASE', $4, 'استلام عمولة')`,
          [sysWallet.rows[0].id, commission, opId, params.idempotencyKey]
        );
      }

      await client.query("COMMIT");
      return { sellerAmount, commission };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally { client.release(); }
  }
}
