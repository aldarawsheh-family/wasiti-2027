// WASITI 2027 — أدوار الصلاحيات (RBAC - Role Based Access Control)
// المسار: src/lib/security/rbac.ts

// تعريف الأدوار المتاحة في النظام
export type Role = 'admin' | 'company_owner' | 'dealer' | 'seller' | 'user';

// تعريف الصلاحيات لكل دور (مصفوفة من الأسماء)
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: ['*'], // جميع الصلاحيات
  company_owner: [
    'manage_company',
    'manage_members',
    'publish_listings',
    'create_deals',
    'view_analytics',
    'view_reports',
  ],
  dealer: ['publish_listings', 'create_deals', 'view_analytics'],
  seller: ['publish_listings', 'create_deals'],
  user: ['view_listings', 'create_deals'],
};

// --- التحقق من أن المستخدم يمتلك دوراً محدداً ---
export const hasRole = (user: { roles?: Role[] }, role: Role): boolean => {
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

// --- التحقق من أن المستخدم يمتلك صلاحية محددة ---
export const hasPermission = (user: { roles?: Role[] }, permission: string): boolean => {
  if (!user || !user.roles) return false;

  // إذا كان المستخدم من نوع admin، يمتلك جميع الصلاحيات
  if (user.roles.includes('admin')) return true;

  // التحقق من أن المستخدم يمتلك الصلاحية في أحد أدواره
  return user.roles.some((role) => {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  });
};

// --- جلب الأدوار التي يمتلكها المستخدم ---
export const getUserRoles = (userId: string): Role[] => {
  // ملاحظة: هذه الدالة تحتاج إلى نقطة نهاية (Endpoint) لجلب الأدوار من قاعدة البيانات.
  // حالياً سنقوم بمحاكاة البيانات لأننا لا نعرف إذا كانت الخدمة تدعمها.

  // محاكاة (للاستخدام التجريبي فقط)
  const mockUserRoles: Record<string, Role[]> = {
    'user-1': ['admin'],
    'user-2': ['company_owner'],
    'user-3': ['dealer'],
    'user-4': ['seller'],
    'user-5': ['user'],
  };

  return mockUserRoles[userId] || ['user'];
};