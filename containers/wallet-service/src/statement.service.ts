import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class StatementService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async generateStatement(walletId: string, fromDate: string, toDate: string) {
    const wallet = await this.pool.query(
      "SELECT * FROM wallet.wallets WHERE id = $1",
      [walletId]
    );
    if (!wallet.rows.length) throw new NotFoundException("المحفظة غير موجودة");

    const entries = await this.pool.query(
      `SELECT 
        created_at,
        entry_type,
        amount,
        operation_type,
        description
       FROM wallet.ledger_entries
       WHERE wallet_id = $1 AND created_at BETWEEN $2 AND $3
       ORDER BY created_at ASC`,
      [walletId, fromDate, toDate + "T23:59:59Z"]
    );

    let balance = 0;
    const statement = entries.rows.map((row: any) => {
      balance = row.entry_type === "CREDIT" ? balance + parseFloat(row.amount) : balance - parseFloat(row.amount);
      return { ...row, balance: balance };
    });

    return {
      wallet: wallet.rows[0],
      period: { from: fromDate, to: toDate },
      totalEntries: entries.rows.length,
      finalBalance: balance,
      entries: statement,
    };
  }

  async getWalletByUserId(userId: string, tenantId: string) {
    const result = await this.pool.query(
      "SELECT id FROM wallet.wallets WHERE user_id = $1 AND tenant_id = $2",
      [userId, tenantId]
    );
    if (!result.rows.length) throw new NotFoundException("المحفظة غير موجودة");
    return result.rows[0];
  }
}
