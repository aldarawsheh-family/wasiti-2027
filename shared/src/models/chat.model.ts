// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Chat Model
// ══════════════════════════════════════════════════

export interface ChatRoom {
  id: string;
  tenantId: string;
  listingId?: string;
  participants: string[];
  lastMessageAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'location' | 'deal_offer';
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}