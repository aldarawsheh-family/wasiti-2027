// ══════════════════════════════════════════════════
// WASITI 2027 — Company Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { DealerController } from './dealer.controller';
import { BookingController } from './booking.controller';
import { TransportController } from './transport.controller';
import { ShopController } from './shop.controller';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { AuthGuard } from './common/guards/auth.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantScopeGuard } from './common/guards/tenant-scope.guard';
import { AuditLogInterceptor } from './common/interceptors/audit-log.interceptor';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'wasity-jwt-secret-change-in-production-2027',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CompanyController, DealerController, BookingController, TransportController, ShopController, MemberController],
  providers: [
    CompanyService, MemberService, AuthGuard, TenantGuard, RolesGuard, TenantScopeGuard,
    AuditLogInterceptor,
    { provide: APP_INTERCEPTOR, useClass: AuditLogInterceptor },
  ],
})
export class AppModule {}