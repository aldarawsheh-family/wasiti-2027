// ══════════════════════════════════════════════════
// WASITI 2027 — Notification Service — WebSocket Channel
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { NotificationGateway } from '../notification.gateway';

@Injectable()
export class WebsocketChannel {
  constructor(private readonly gateway: NotificationGateway) {}

  async send(userId: string, notification: any) {
    this.gateway.sendToUser(userId, notification);
  }
}