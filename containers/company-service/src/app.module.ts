// ══════════════════════════════════════════════════
// WASITI 2027 — Company Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
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
  controllers: [CompanyController, MemberController],
  providers: [CompanyService, MemberService, AuthGuard, TenantGuard, RolesGuard],
})
export class AppModule {}