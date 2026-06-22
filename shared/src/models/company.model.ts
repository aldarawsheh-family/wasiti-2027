// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — Company Model
// ══════════════════════════════════════════════════

export interface Company {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  type: 'DEALER' | 'SHOP' | 'ENTERPRISE';
  description?: Record<string, string>;
  logoUrl?: string;
  coverUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
  verified: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMember {
  id: string;
  companyId: string;
  userId: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  permissions: string[];
  joinedAt: string;
}