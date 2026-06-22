// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Deal Model
// ══════════════════════════════════════════════════

export interface Deal {
  id: string;
  tenantId: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  offerPrice?: number;
  currency: string;
  message?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const DEAL_STATUSES = ['PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED'] as const;