import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class TransferService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async transfer(params: {
    fromWalletId: string; toWalletId: string; amount: number;
    currency: string; description?: string; idempotencyKey?: string;
  }) {
    const { fromWalletId, toWalletId, amount, currency, description, idempotencyKey } = params;
    const key = idempotencyKey || uuidv4();

    if (fromWalletId === toWalletId) throw new BadRequestException("لا يمكن التحويل لنفس المحفظة");

    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const opId = uuidv4();

      await client.query(
        `INSERT INTO wallet.ledger_entries (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'DEBIT', $2, $3, 'TRANSFER', $4, $5)`,
        [fromWalletId, amount, opId, key, description || "تحويل إلى محفظة أخرى"]
      );
      await client.query(
        `INSERT INTO wallet.ledger_entries (wallet_id, entry_type, amount, operation_id, operation_type, idempotency_key, description)
         VALUES ($1, 'CREDIT', $2, $3, 'TRANSFER', $4, $5)`,
        [toWalletId, amount, opId, key, description || "استلام تحويل"]
      );

      await client.query("COMMIT");
      return { status: "TRANSFERRED", operationId: opId };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally { client.release(); }
  }
}
