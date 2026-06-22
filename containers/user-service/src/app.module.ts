// ══════════════════════════════════════════════════
// WASITI 2027 — User Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [],
  controllers: [UserController, ProfileController],
  providers: [UserService],
})
export class AppModule {}