// ══════════════════════════════════════════════════
// WASITI 2027 — Deals Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { StateMachine } from './state-machine';
import { AuditService } from './audit.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'wasity-jwt-secret-change-in-production-2027',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [DealController],
  providers: [DealService, StateMachine, AuditService, AuthGuard, TenantGuard, RolesGuard],
})
export class AppModule {}