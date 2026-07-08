import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class SettlementService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async generateDailySettlement() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(yesterday.setHours(23, 59, 59, 999));

    const result = await this.pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE 0 END), 0) as total_credits,
        COALESCE(SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE 0 END), 0) as total_debits
       FROM wallet.ledger_entries
       WHERE created_at BETWEEN $1 AND $2`,
      [start, end]
    );

    const { total_credits, total_debits } = result.rows[0];
    const net = parseFloat(total_credits) - parseFloat(total_debits);

    const settlement = await this.pool.query(
      `INSERT INTO wallet.settlements
       (settlement_type, period_start, period_end, total_credits, total_debits, net_amount)
       VALUES ('DAILY', $1, $2, $3, $4, $5)
       RETURNING *`,
      [start, end, total_credits, total_debits, net]
    );

    return settlement.rows[0];
  }

  async getSettlements(type?: string) {
    let query = "SELECT * FROM wallet.settlements";
    const params: any[] = [];
    
    if (type) {
      query += " WHERE settlement_type = $1";
      params.push(type);
    }
    
    query += " ORDER BY generated_at DESC LIMIT 30";
    
    const result = await this.pool.query(query, params);
    return result.rows;
  }
}
