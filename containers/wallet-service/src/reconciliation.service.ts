import { Injectable, Inject } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class ReconciliationService {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  async runDailyReconciliation() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = yesterday.toISOString().split("T")[0];
    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(yesterday.setHours(23, 59, 59, 999));

    // 1. احسب مجموع ledger_entries الداخلي
    const internal = await this.pool.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN entry_type = 'CREDIT' THEN amount ELSE 0 END), 0) as credits,
        COALESCE(SUM(CASE WHEN entry_type = 'DEBIT' THEN amount ELSE 0 END), 0) as debits
       FROM wallet.ledger_entries
       WHERE created_at BETWEEN $1 AND $2`,
      [start, end]
    );

    const internalTotal = parseFloat(internal.rows[0].credits) - parseFloat(internal.rows[0].debits);
    let discrepancy = 0;
    let status = "MATCHED";

    // 2. تحقق من توازن القيد المزدوج
    if (parseFloat(internal.rows[0].credits) !== parseFloat(internal.rows[0].debits)) {
      discrepancy = Math.abs(parseFloat(internal.rows[0].credits) - parseFloat(internal.rows[0].debits));
      status = "MISMATCH";
    }

    // 3. أنشئ تقرير المطابقة
    const result = await this.pool.query(
      `INSERT INTO wallet.reconciliation_reports
       (report_date, internal_total, discrepancy, status, details)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [reportDate, internalTotal, discrepancy, status, JSON.stringify({ credits: internal.rows[0].credits, debits: internal.rows[0].debits })]
    );

    return result.rows[0];
  }

  async getReports(limit: number = 30) {
    const result = await this.pool.query(
      "SELECT * FROM wallet.reconciliation_reports ORDER BY report_date DESC LIMIT $1",
      [limit]
    );
    return result.rows;
  }
}
