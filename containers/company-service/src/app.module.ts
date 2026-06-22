// ══════════════════════════════════════════════════
// WASITI 2027 — Company Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

@Module({
  imports: [],
  controllers: [CompanyController, MemberController],
  providers: [CompanyService, MemberService],
})
export class AppModule {}