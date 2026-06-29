// WASITI 2027 — دوال التحقق من الصلاحيات (Permissions)
// المسار: src/lib/security/permissions.ts

import { hasRole, hasPermission, Role } from './rbac';

// --- التحقق من إمكانية إنشاء إعلان ---
export const canCreateListing = (user: { roles?: Role[] }): boolean => {
  // يمكن لجميع الأدوار باستثناء 'user' إنشاء إعلانات
  if (!user || !user.roles) return false;
  return hasPermission(user, 'publish_listings');
};

// --- التحقق من إمكانية تعديل إعلان (المالك فقط أو من يملك الصلاحية) ---
export const canEditListing = (user: { roles?: Role[] }, listingOwnerId: string, currentUserId: string): boolean => {
  if (!user || !user.roles) return false;
  // إذا كان admin أو company_owner، يمكنهم تعديل أي إعلان
  if (hasRole(user, 'admin') || hasRole(user, 'company_owner')) return true;
  // وإلا، يجب أن يكون المستخدم هو مالك الإعلان
  return listingOwnerId === currentUserId;
};

// --- التحقق من إمكانية حذف إعلان ---
export const canDeleteListing = (user: { roles?: Role[] }, listingOwnerId: string, currentUserId: string): boolean => {
  if (!user || !user.roles) return false;
  // إذا كان admin، يمكنه حذف أي إعلان
  if (hasRole(user, 'admin')) return true;
  // وإلا، يجب أن يكون المستخدم هو مالك الإعلان
  return listingOwnerId === currentUserId;
};

// --- التحقق من إمكانية الوصول إلى لوحة تحكم المالك (Admin) ---
export const canAccessAdmin = (user: { roles?: Role[] }): boolean => {
  if (!user || !user.roles) return false;
  return hasRole(user, 'admin');
};

// --- التحقق من إمكانية الوصول إلى لوحة تحكم الشركة ---
export const canAccessCompany = (user: { roles?: Role[] }): boolean => {
  if (!user || !user.roles) return false;
  return hasRole(user, 'company_owner');
};