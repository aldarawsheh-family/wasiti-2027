import { Controller, Get, Post, Param, Body, Req, Query, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { EscrowService } from "./escrow.service";
import { RefundService } from "./refund.service";
import { StatementService } from "./statement.service";
import { AuthGuard } from "./common/guards/auth.guard";
import { TenantGuard } from "./common/guards/tenant.guard";
import { WalletPermissionGuard, WalletPermission } from "./common/guards/wallet-permission.guard";

@Controller()
@UseGuards(AuthGuard, TenantGuard, WalletPermissionGuard)
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly escrowService: EscrowService,
    private readonly refundService: RefundService,
    private readonly statementService: StatementService
  ) {}

  @Get("me")
  async getMyWallet(@Req() req: any) {
    return this.walletService.getOrCreateWallet(req.userId, req.tenantId);
  }

  @Get("me/statement")
  async getMyStatement(@Req() req: any, @Query("from") from: string, @Query("to") to: string) {
    const wallet = await this.statementService.getWalletByUserId(req.userId, req.tenantId);
    return this.statementService.generateStatement(wallet.id, from || "2026-01-01", to || new Date().toISOString().split("T")[0]);
  }

  @Post("request")
  async requestTransaction(@Req() req: any, @Body() body: any) {
    return this.walletService.requestTransaction(
      req.userId,
      req.tenantId,
      body.type,
      body.amount,
      body.meta || {},
      body.idempotencyKey || require("uuid").v4(),
    );
  }

  @Post("approve/:id")
  @WalletPermission("wallet.approve")
  async approveTransaction(@Req() req: any, @Param("id") id: string) {
    return this.walletService.approveTransaction(id, req.userId, req.role);
  }

  @Post("reject/:id")
  @WalletPermission("wallet.reject")
  async rejectTransaction(@Req() req: any, @Param("id") id: string, @Body() body: any) {
    return this.walletService.rejectTransaction(id, req.userId, req.role, body.reason || "بدون سبب");
  }

  @Post("review/:id")
  async reviewTransaction(@Req() req: any, @Param("id") id: string) {
    return this.walletService.reviewTransaction(id, req.userId, req.role);
  }

  @Get("requests")
  async getRequests(@Req() req: any, @Query("status") status?: string) {
    const all = await this.walletService.getRequests(status);
    if (req.role === 'ADMIN' || req.role === 'PLATFORM_OWNER') return all;
    return all.filter((r: any) => r.user_id === req.userId || r.wallet_user_id === req.userId);
  }

  @Post("cancel/:id")
  async cancelTransaction(@Req() req: any, @Param("id") id: string) {
    return this.walletService.cancelTransaction(id, req.userId);
  }

  @Post("escrow/hold")
  async holdFunds(@Req() req: any, @Body() body: any) {
    return this.escrowService.holdFunds({
      buyerWalletId: body.buyerWalletId,
      sellerWalletId: body.sellerWalletId,
      amount: body.amount,
      currency: body.currency || "SYP",
      referenceType: body.referenceType,
      referenceId: body.referenceId,
      idempotencyKey: body.idempotencyKey || require("uuid").v4(),
    });
  }

  @Post("escrow/release/:id")
  async releaseToSeller(@Req() req: any, @Param("id") id: string) {
    return this.escrowService.releaseToSeller(id, req.userId);
  }

  @Post("escrow/refund/:id")
  async refundToBuyer(@Req() req: any, @Param("id") id: string) {
    return this.escrowService.refundToBuyer(id, req.userId);
  }

  @Get("escrow/reference/:type/:id")
  async getByReference(@Param("type") type: string, @Param("id") id: string) {
    return this.escrowService.getByReference(type, id);
  }

  @Get("escrow/:id/transitions")
  async getTransitions(@Param("id") id: string) {
    return this.escrowService.getTransitions(id);
  }

  @Post("refund/request")
  async createRefundRequest(@Req() req: any, @Body() body: any) {
    const wallet = await this.walletService.getOrCreateWallet(req.userId, req.tenantId);
    return this.refundService.createRequest({
      walletId: wallet.id,
      referenceType: body.referenceType,
      referenceId: body.referenceId,
      amount: body.amount,
      reason: body.reason,
      requestedBy: "user",
      idempotencyKey: body.idempotencyKey || require("uuid").v4(),
    });
  }

  @Post("refund/approve")
  async approveRefund(@Req() req: any, @Body() body: any) {
    return this.refundService.approve({
      refundId: body.refundId,
      adminUserId: req.userId,
      decision: body.decision,
      note: body.note,
    });
  }

  @Post("refund/execute/:id")
  async executeRefund(@Req() req: any, @Param("id") id: string, @Body() body: any) {
    return this.refundService.execute(id, body.sourceWalletId);
  }
}