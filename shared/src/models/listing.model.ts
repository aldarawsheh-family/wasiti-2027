// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Listing Model
// ══════════════════════════════════════════════════

export interface Listing {
  id: string;
  tenantId: string;
  ownerId: string;
  companyId?: string;
  categoryId?: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  price?: number;
  currency: string;
  priceType: 'FIXED' | 'NEGOTIABLE' | 'AUCTION';
  city?: Record<string, string>;
  district?: Record<string, string>;
  address?: Record<string, string>;
  images: string[];
  videoUrl?: string;
  status: 'ACTIVE' | 'SOLD' | 'EXPIRED' | 'DRAFT' | 'SUSPENDED' | 'DELETED';
  isBoosted: boolean;
  isFeatured: boolean;
  viewCount: number;
  favoriteCount: number;
  contactCount: number;
  metadata?: Record<string, any>;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}