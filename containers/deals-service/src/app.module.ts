// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { StateMachine } from './state-machine';
import { AuditService } from './audit.service';

@Module({
  imports: [],
  controllers: [DealController],
  providers: [DealService, StateMachine, AuditService],
})
export class AppModule {}