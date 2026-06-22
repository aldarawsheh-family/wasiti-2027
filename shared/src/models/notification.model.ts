// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Notification Model
// ══════════════════════════════════════════════════

export interface Notification {
  id: string;
  tenantId: string;
  userId: string;
  type: string;
  title: Record<string, string>;
  body?: Record<string, string>;
  data?: Record<string, any>;
  link?: string;
  icon?: string;
  isRead: boolean;
  readAt?: string;
  channel: 'in_app' | 'websocket' | 'email' | 'push';
  createdAt: string;
}