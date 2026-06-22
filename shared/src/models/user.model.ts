// ══════════════════════════════════════════════════
// WASITI 2027 — Shared — User Model
// ══════════════════════════════════════════════════

export interface User {
  id: string;
  tenantId: string;
  email: string;
  phone?: string;
  displayName?: string;
  avatarUrl?: string;
  role: 'USER' | 'SELLER' | 'COMPANY_ADMIN' | 'PLATFORM_ADMIN';
  trustScore: number;
  isVerified: boolean;
  isBanned: boolean;
  language: string;
  theme: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}