import { Controller, Post, Get, Body, Param, UseGuards, Inject } from "@nestjs/common";
import { Pool } from "pg";
import { AuthGuard } from "./common/guards/auth.guard";
import { TenantGuard } from "./common/guards/tenant.guard";
import { WalletPermissionGuard, WalletPermission } from "./common/guards/wallet-permission.guard";

@Controller("wallet/admin")
@UseGuards(AuthGuard, TenantGuard, WalletPermissionGuard)
export class AdminController {
  constructor(@Inject("PG_POOL") private readonly pool: Pool) {}

  @Post("permissions/grant")
  @WalletPermission("manage_permissions")
  async grantPermission(@Body() body: any) {
    const result = await this.pool.query(
      `INSERT INTO wallet.admin_permissions (admin_user_id, permission_code, granted_by)
       VALUES ($1, $2, $3)
       ON CONFLICT (admin_user_id, permission_code) WHERE revoked_at IS NULL
       DO NOTHING
       RETURNING *`,
      [body.adminUserId, body.permissionCode, body.grantedBy]
    );
    return result.rows[0] || { message: "Permission already exists" };
  }

  @Post("permissions/revoke")
  @WalletPermission("manage_permissions")
  async revokePermission(@Body() body: any) {
    await this.pool.query(
      `UPDATE wallet.admin_permissions SET revoked_at = NOW()
       WHERE admin_user_id = $1 AND permission_code = $2 AND revoked_at IS NULL`,
      [body.adminUserId, body.permissionCode]
    );
    return { message: "Permission revoked" };
  }

  @Get("permissions/:userId")
  @WalletPermission("view_permissions")
  async getUserPermissions(@Param("userId") userId: string) {
    const result = await this.pool.query(
      "SELECT * FROM wallet.admin_permissions WHERE admin_user_id = $1 AND revoked_at IS NULL",
      [userId]
    );
    return result.rows;
  }

  @Get("settlements")
  @WalletPermission("view_settlements")
  async getSettlements() {
    const result = await this.pool.query(
      "SELECT * FROM wallet.settlements ORDER BY generated_at DESC LIMIT 30"
    );
    return result.rows;
  }

  @Post("settlements/generate")
  @WalletPermission("manage_settlements")
  async generateSettlement() {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(yesterday.setHours(23, 59, 59, 999));

    const r = await this.pool.query(
      `SELECT COALESCE(SUM(CASE WHEN entry_type='CREDIT' THEN amount ELSE 0 END),0) as c,
              COALESCE(SUM(CASE WHEN entry_type='DEBIT' THEN amount ELSE 0 END),0) as d
       FROM wallet.ledger_entries WHERE created_at BETWEEN $1 AND $2`,
      [start, end]
    );
    const { c, d } = r.rows[0];
    const net = parseFloat(c) - parseFloat(d);

    const result = await this.pool.query(
      `INSERT INTO wallet.settlements (settlement_type, period_start, period_end, total_credits, total_debits, net_amount)
       VALUES ('DAILY', $1, $2, $3, $4, $5) RETURNING *`,
      [start, end, c, d, net]
    );
    return result.rows[0];
  }

  @Get("reconciliation")
  @WalletPermission("view_reconciliation")
  async getReconciliation() {
    const result = await this.pool.query(
      "SELECT * FROM wallet.reconciliation_reports ORDER BY report_date DESC LIMIT 30"
    );
    return result.rows;
  }

  @Post("reconciliation/run")
  @WalletPermission("manage_reconciliation")
  async runReconciliation() {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const reportDate = yesterday.toISOString().split("T")[0];
    const start = new Date(yesterday.setHours(0, 0, 0, 0));
    const end = new Date(yesterday.setHours(23, 59, 59, 999));

    const internal = await this.pool.query(
      `SELECT COALESCE(SUM(CASE WHEN entry_type='CREDIT' THEN amount ELSE 0 END),0) as c,
              COALESCE(SUM(CASE WHEN entry_type='DEBIT' THEN amount ELSE 0 END),0) as d
       FROM wallet.ledger_entries WHERE created_at BETWEEN $1 AND $2`,
      [start, end]
    );
    const { c, d } = internal.rows[0];
    const total = parseFloat(c) - parseFloat(d);
    let disc = 0, status = "MATCHED";
    if (parseFloat(c) !== parseFloat(d)) { disc = Math.abs(parseFloat(c) - parseFloat(d)); status = "MISMATCH"; }

    const result = await this.pool.query(
      `INSERT INTO wallet.reconciliation_reports (report_date, internal_total, discrepancy, status, details)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [reportDate, total, disc, status, JSON.stringify({ credits: c, debits: d })]
    );
    return result.rows[0];
  }
}
