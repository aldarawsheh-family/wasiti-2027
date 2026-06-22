// ══════════════════════════════════════════════════
// WASITI 2027 — Notification Service — Dispatcher
// ══════════════════════════════════════════════════

import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { WebsocketChannel } from './channels/websocket';
import { InAppChannel } from './channels/in-app';

@Injectable()
export class DispatcherService {
  private db: Pool;

  constructor(
    private readonly ws: WebsocketChannel,
    private readonly inApp: InAppChannel,
  ) {
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async send(notification: {
    tenantId: string;
    userId: string;
    type: string;
    title: any;
    body?: any;
    link?: string;
    icon?: string;
    channels?: string[];
  }) {
    const channels = notification.channels || ['websocket', 'in_app'];

    if (channels.includes('websocket')) {
      await this.ws.send(notification.userId, notification);
    }

    if (channels.includes('in_app')) {
      await this.inApp.send(this.db, notification.tenantId, notification);
    }
  }
}