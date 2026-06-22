// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Tenant Model
// ══════════════════════════════════════════════════

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  type: 'INDIVIDUAL' | 'COMPANY' | 'MARKETPLACE';
  logoUrl?: string;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  isActive: boolean;
  maxUsers: number;
  maxListings: number;
  subscription: 'FREE' | 'PRO' | 'ENTERPRISE';
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}