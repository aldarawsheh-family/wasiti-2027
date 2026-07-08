import { z } from 'zod';

// القيم المسموحة للـ sidebar
const ALLOWED_SECTIONS = [
  'listings', 'clients', 'deals',
  'property-info', 'rooms', 'reservations', 'reviews', 'calendar',
  'company-info', 'vehicles', 'trips', 'bookings',
  'products', 'orders',
  'team', 'settings',
] as const;

export const tenantManifestSchema = z.object({
  sidebar: z.array(z.enum(ALLOWED_SECTIONS)).min(1).max(10),
});

export type TenantManifest = z.infer<typeof tenantManifestSchema>;

// Fallback آمن إذا الـ manifest فشل
export const FALLBACK_SIDEBAR = ['listings', 'settings'];

// دالة التحقق — ترجع sidebar صحيح أو fallback
export function validateManifest(manifest: unknown): string[] {
  const result = tenantManifestSchema.safeParse(manifest);
  if (result.success) {
    return result.data.sidebar;
  }
  console.warn('Invalid manifest, using fallback:', result.error);
  return FALLBACK_SIDEBAR;
}