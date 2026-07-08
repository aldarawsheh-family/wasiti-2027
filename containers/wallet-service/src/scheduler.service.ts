import { Injectable } from "@nestjs/common";
import { SettlementService } from "./settlement.service";
import { ReconciliationService } from "./reconciliation.service";
import { AccountingService } from "./accounting.service";

@Injectable()
export class SchedulerService {
  constructor(
    private readonly settlement: SettlementService,
    private readonly reconciliation: ReconciliationService,
    private readonly accounting: AccountingService,
  ) {}

  // @Cron('0 1 * * *') - كل يوم 1 فجراً
  async dailySettlement() { return this.settlement.generateDailySettlement(); }

  // @Cron('0 3 * * *') - كل يوم 3 فجراً
  async dailyReconciliation() { return this.reconciliation.runDailyReconciliation(); }

  // @Cron('0 0 1 * *') - أول كل شهر
  async closeMonthlyPeriod() { return this.accounting.createMonthlyPeriod(); }
}
