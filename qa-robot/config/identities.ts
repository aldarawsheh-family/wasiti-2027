export interface Identity {
  id: string;
  name: string;
  role: string;
  email: string;
  password: string;
  tenantId: string;
  loginUrl: string;
  dashboardUrl: string;
  allowedPages: string[];
  forbiddenPages: string[];
  walletType: string;
}

export const IDENTITIES: Identity[] = [
  {
    id: 'super_admin',
    name: 'مدير عام - Super Admin',
    role: 'PLATFORM_OWNER',
    email: 'admin2@wasity.ly',
    password: 'Wasity@2026',
    tenantId: '00000000-0000-0000-0000-000000000001',
    loginUrl: '/ar/auth/login',
    dashboardUrl: '/ar/admin',
    allowedPages: [],
    forbiddenPages: [],
    walletType: 'system',
  },
  {
    id: 'admin_manager',
    name: 'مدير المنصة - Admin Manager',
    role: 'ADMIN',
    email: 'admin@wasity.ly',
    password: 'Wasity@2026',
    tenantId: '00000000-0000-0000-0000-000000000001',
    loginUrl: '/ar/auth/login',
    dashboardUrl: '/ar/admin',
    allowedPages: ['/ar/admin'],
    forbiddenPages: ['/ar/admin/system', '/ar/admin/wallet'],
    walletType: 'system',
  },
  {
    id: 'admin_moderator',
    name: 'مشرف محتوى - Moderator',
    role: 'SUPPORT',
    email: 'support@wasity.ly',
    password: 'Wasity@2026',
    tenantId: '00000000-0000-0000-0000-000000000001',
    loginUrl: '/ar/auth/login',
    dashboardUrl: '/ar/admin',
    allowedPages: ['/ar/admin/listings', '/ar/admin/support', '/ar/admin/reports'],
    forbiddenPages: ['/ar/admin/users', '/ar/admin/wallet', '/ar/admin/system'],
    walletType: 'none',
  },
  {
    id: 'company_owner',
    name: 'صاحب شركة - Company Owner',
    role: 'COMPANY_ADMIN',
    email: 'test.user@wasity.ly',
    password: 'Wasity@2026',
    tenantId: '00000000-0000-0000-0000-000000000001',
    loginUrl: '/ar/auth/login',
    dashboardUrl: '/ar/dashboard/company',
    allowedPages: ['/ar/dashboard/company'],
    forbiddenPages: ['/ar/admin'],
    walletType: 'company',
  },
  {
    id: 'personal_seller',
    name: 'بائع شخصي - Seller',
    role: 'SELLER',
    email: 'seller@wasity.ly',
    password: 'Wasity@2026',
    tenantId: '00000000-0000-0000-0000-000000000001',
    loginUrl: '/ar/auth/login',
    dashboardUrl: '/ar/dashboard',
    allowedPages: ['/ar/dashboard', '/ar/dashboard/seller', '/ar/dashboard/wallet'],
    forbiddenPages: ['/ar/admin', '/ar/dashboard/company'],
    walletType: 'personal',
  },
  {
    id: 'personal_buyer',
    name: 'مستخدم شخصي - Buyer',
    role: 'USER',
    email: 'buyer@wasity.ly',
    password: 'Wasity@2026',
    tenantId: '00000000-0000-0000-0000-000000000001',
    loginUrl: '/ar/auth/login',
    dashboardUrl: '/ar/dashboard',
    allowedPages: ['/ar/dashboard', '/ar/dashboard/wallet'],
    forbiddenPages: ['/ar/admin', '/ar/dashboard/company', '/ar/dashboard/seller'],
    walletType: 'personal',
  },
];