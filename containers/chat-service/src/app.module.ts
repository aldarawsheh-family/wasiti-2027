a// ══════════════════════════════════════════════════
// WASITI 2027 — Chat Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageService } from './message.service';
import { RoomService } from './room.service';
import { PresenceService } from './presence.service';

@Module({
  imports: [],
  providers: [ChatGateway, MessageService, RoomService, PresenceService],
})
export class AppModule {}