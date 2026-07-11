export interface PermissionMatrix {
  role: string;
  page: string;
  expectedStatus: 200 | 403 | 302;
}

export const RBAC_MATRIX: PermissionMatrix[] = [
  // Super Admin - كل الصفحات 200
  { role: 'PLATFORM_OWNER', page: '/ar/admin/users', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/admin/listings', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/admin/deals', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/admin/wallet/requests', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/admin/system', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/admin/support', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/dashboard', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/dashboard/wallet', expectedStatus: 200 },
  { role: 'PLATFORM_OWNER', page: '/ar/dashboard/company', expectedStatus: 200 },

  // Admin Manager
  { role: 'ADMIN', page: '/ar/admin/users', expectedStatus: 200 },
  { role: 'ADMIN', page: '/ar/admin/listings', expectedStatus: 200 },
  { role: 'ADMIN', page: '/ar/admin/deals', expectedStatus: 200 },
  { role: 'ADMIN', page: '/ar/admin/wallet/requests', expectedStatus: 200 },
  { role: 'ADMIN', page: '/ar/admin/system', expectedStatus: 403 },
  { role: 'ADMIN', page: '/ar/dashboard', expectedStatus: 200 },

  // Moderator
  { role: 'SUPPORT', page: '/ar/admin/listings', expectedStatus: 200 },
  { role: 'SUPPORT', page: '/ar/admin/support', expectedStatus: 200 },
  { role: 'SUPPORT', page: '/ar/admin/users', expectedStatus: 403 },
  { role: 'SUPPORT', page: '/ar/admin/wallet/requests', expectedStatus: 403 },
  { role: 'SUPPORT', page: '/ar/admin/system', expectedStatus: 403 },
  { role: 'SUPPORT', page: '/ar/dashboard', expectedStatus: 200 },

  // Company Owner
  { role: 'COMPANY_ADMIN', page: '/ar/dashboard/company', expectedStatus: 200 },
  { role: 'COMPANY_ADMIN', page: '/ar/dashboard/company/members', expectedStatus: 200 },
  { role: 'COMPANY_ADMIN', page: '/ar/dashboard/company/settings', expectedStatus: 200 },
  { role: 'COMPANY_ADMIN', page: '/ar/admin/users', expectedStatus: 403 },
  { role: 'COMPANY_ADMIN', page: '/ar/admin/listings', expectedStatus: 403 },
  { role: 'COMPANY_ADMIN', page: '/ar/admin/wallet/requests', expectedStatus: 403 },
  { role: 'COMPANY_ADMIN', page: '/ar/dashboard', expectedStatus: 200 },

 

  // Personal Seller
  { role: 'SELLER', page: '/ar/dashboard', expectedStatus: 200 },
  { role: 'SELLER', page: '/ar/dashboard/seller', expectedStatus: 200 },
  { role: 'SELLER', page: '/ar/dashboard/wallet', expectedStatus: 200 },
  { role: 'SELLER', page: '/ar/admin', expectedStatus: 403 },
  { role: 'SELLER', page: '/ar/dashboard/company', expectedStatus: 403 },

  // Personal Buyer
  { role: 'USER', page: '/ar/dashboard', expectedStatus: 200 },
  { role: 'USER', page: '/ar/dashboard/wallet', expectedStatus: 200 },
  { role: 'USER', page: '/ar/dashboard/seller', expectedStatus: 403 },
  { role: 'USER', page: '/ar/dashboard/company', expectedStatus: 403 },
  { role: 'USER', page: '/ar/admin', expectedStatus: 403 },
  { role: 'USER', page: '/ar/admin/users', expectedStatus: 403 },
];