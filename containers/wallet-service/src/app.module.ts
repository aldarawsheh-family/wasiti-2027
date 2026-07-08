import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { Pool } from "pg";
import { WalletController } from "./wallet.controller";
import { AdminController } from "./admin.controller";
import { WalletService } from "./wallet.service";
import { CurrencyService } from "./currency.service";
import { EscrowService } from "./escrow.service";
import { RefundService } from "./refund.service";
import { EventPublisher } from "./event-publisher.service";
import { LimitsService } from "./limits.service";
import { CommissionService } from "./commission.service";
import { TransferService } from "./transfer.service";
import { SettlementService } from "./settlement.service";
import { ReconciliationService } from "./reconciliation.service";
import { AccountingService } from "./accounting.service";
import { StatementService } from "./statement.service";
import { SchedulerService } from "./scheduler.service";
import { WalletEventsService } from "./wallet-events.service";
import { WebhooksController } from "./webhooks.controller";
import { HealthController } from "./health.controller";
import { AuthGuard } from "./common/guards/auth.guard";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "wasity-jwt-secret-change-in-production-2027",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [WalletController, AdminController, WebhooksController, HealthController],
  providers: [
    WalletService, CurrencyService, EscrowService, RefundService,
    TransferService,
    EventPublisher,
    LimitsService,
    CommissionService, SettlementService, ReconciliationService,
    AccountingService, StatementService, SchedulerService,
    WalletEventsService, AuthGuard,
    { provide: "PG_POOL", useFactory: () => new Pool({ connectionString: process.env.DATABASE_URL }) },
  ],
})
export class AppModule {}


