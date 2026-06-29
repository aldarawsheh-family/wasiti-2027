// ══════════════════════════════════════════════════
// WASITI 2027 — User Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileController } from './profile.controller';
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
  controllers: [UserController, ProfileController],
  providers: [UserService, AuthGuard, TenantGuard, RolesGuard],
})
export class AppModule {}