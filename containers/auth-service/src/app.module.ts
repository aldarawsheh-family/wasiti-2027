// ══════════════════════════════════════════════════
// WASITI 2027 — Auth Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { RedisService } from './redis.service';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, JwtService, RedisService],
})
export class AppModule {}