import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class AccountingService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async createMonthlyPeriod() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const existing = await this.pool.query(
      "SELECT id FROM wallet.accounting_periods WHERE period_start = $1 AND period_type = 'MONTHLY'",
      [start]
    );
    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    const result = await this.pool.query(
      `INSERT INTO wallet.accounting_periods (period_type, period_start, period_end)
       VALUES ('MONTHLY', $1, $2) RETURNING *`,
      [start, end]
    );
    return result.rows[0];
  }

  async closePeriod(periodId: string, closedBy: string) {
    const period = await this.pool.query(
      "SELECT * FROM wallet.accounting_periods WHERE id = $1",
      [periodId]
    );
    if (!period.rows.length) throw new BadRequestException("الفترة غير موجودة");
    if (period.rows[0].status !== "OPEN") throw new BadRequestException("الفترة مقفولة بالفعل");

    const summary = await this.pool.query(
      `SELECT 
        COUNT(*) as total_entries,
        COALESCE(SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE 0 END), 0) as total_credits,
        COALESCE(SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE 0 END), 0) as total_debits
       FROM wallet.ledger_entries
       WHERE created_at BETWEEN $1 AND $2`,
      [period.rows[0].period_start, period.rows[0].period_end + "T23:59:59Z"]
    );

    await this.pool.query(
      `UPDATE wallet.accounting_periods SET status = 'CLOSED', closed_by = $1, closed_at = NOW(), summary = $2 WHERE id = $3`,
      [closedBy, JSON.stringify(summary.rows[0]), periodId]
    );

    return { status: "CLOSED", summary: summary.rows[0] };
  }

  async getPeriods(status?: string) {
    let query = "SELECT * FROM wallet.accounting_periods";
    const params: any[] = [];
    if (status) { query += " WHERE status = $1"; params.push(status); }
    query += " ORDER BY period_start DESC LIMIT 12";
    const result = await this.pool.query(query, params);
    return result.rows;
  }

  async isPeriodOpen(date: Date): Promise<boolean> {
    const result = await this.pool.query(
      `SELECT status FROM wallet.accounting_periods WHERE period_start <= $1 AND period_end >= $1`,
      [date]
    );
    if (result.rows.length === 0) return true;
    return result.rows[0].status === "OPEN";
  }
}
