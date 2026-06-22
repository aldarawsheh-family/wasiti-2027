// ══════════════════════════════════════════════════
// WASITI 2027 — Notification Service — App Module
// ══════════════════════════════════════════════════

import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { FeedService } from './feed.service';
import { DispatcherService } from './dispatcher.service';
import { WebsocketChannel } from './channels/websocket';
import { InAppChannel } from './channels/in-app';

@Module({
  imports: [],
  providers: [NotificationGateway, FeedService, DispatcherService, WebsocketChannel, InAppChannel],
})
export class AppModule {}