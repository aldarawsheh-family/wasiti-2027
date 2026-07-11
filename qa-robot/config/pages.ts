export interface PageInfo {
  path: string;
  title: string;
  category: 'public' | 'auth' | 'dashboard' | 'company' | 'admin';
  element: string;
}

export const PAGES: PageInfo[] = [
  // Public (8)
  { path: '/ar/public', title: 'لاندينغ', category: 'public', element: '[data-testid="hero"]' },
  { path: '/ar/public/home', title: 'الرئيسية', category: 'public', element: '[data-testid="listings-grid"]' },
  { path: '/ar/search', title: 'بحث', category: 'public', element: '[data-testid="search-filters"]' },
  { path: '/ar/listing/test-id', title: 'تفاصيل إعلان', category: 'public', element: '[data-testid="listing-detail"]' },
  { path: '/ar/listing/test-id/edit', title: 'تعديل إعلان', category: 'public', element: 'form' },
  { path: '/ar/listing/create', title: 'إنشاء إعلان', category: 'public', element: 'form' },
  { path: '/ar/checkout/test-id', title: 'شراء', category: 'public', element: '[data-testid="checkout"]' },
  { path: '/ar/publish', title: 'نشر إعلان', category: 'public', element: 'form' },

  // Auth (5)
  { path: '/ar/auth/login', title: 'تسجيل الدخول', category: 'auth', element: 'form' },
  { path: '/ar/auth/register', title: 'إنشاء حساب', category: 'auth', element: 'form' },
  { path: '/ar/auth/forgot-password', title: 'نسيت كلمة المرور', category: 'auth', element: 'form' },
  { path: '/ar/auth/reset-password', title: 'إعادة تعيين', category: 'auth', element: 'form' },
  { path: '/ar/auth/verify-email', title: 'تأكيد بريد', category: 'auth', element: 'button' },

  // Dashboard (14)
  { path: '/ar/dashboard', title: 'لوحة التحكم', category: 'dashboard', element: '[data-testid="dashboard"]' },
  { path: '/ar/dashboard/profile', title: 'ملف شخصي', category: 'dashboard', element: 'form' },
  { path: '/ar/dashboard/wallet', title: 'محفظة', category: 'dashboard', element: '[data-testid="wallet"]' },
  { path: '/ar/dashboard/seller', title: 'تاجر', category: 'dashboard', element: '[data-testid="seller-stats"]' },
  { path: '/ar/dashboard/settings', title: 'إعدادات', category: 'dashboard', element: 'form' },
  { path: '/ar/dashboard/company', title: 'لوحة شركة', category: 'company', element: '[data-testid="company-dashboard"]' },
  { path: '/ar/dashboard/company/settings', title: 'إعدادات شركة', category: 'company', element: 'form' },
  { path: '/ar/dashboard/company/members', title: 'أعضاء', category: 'company', element: 'table' },
  { path: '/ar/dashboard/company/members/invite', title: 'دعوة', category: 'company', element: 'form' },
  { path: '/ar/dashboard/company/dealer', title: 'معارض', category: 'company', element: '[data-testid="dealer"]' },
  { path: '/ar/dashboard/company/booking', title: 'حجوزات', category: 'company', element: '[data-testid="booking"]' },
  { path: '/ar/dashboard/company/transport', title: 'نقل', category: 'company', element: '[data-testid="transport"]' },
  { path: '/ar/dashboard/company/shop', title: 'متجر', category: 'company', element: '[data-testid="shop"]' },
  { path: '/ar/dashboard/company/enterprise', title: 'مؤسسة', category: 'company', element: '[data-testid="enterprise"]' },

  // Admin (13)
  { path: '/ar/admin', title: 'Dashboard', category: 'admin', element: '[data-testid="admin-stats"]' },
  { path: '/ar/admin/users', title: 'مستخدمين', category: 'admin', element: 'table' },
  { path: '/ar/admin/listings', title: 'إعلانات', category: 'admin', element: 'table' },
  { path: '/ar/admin/deals', title: 'صفقات', category: 'admin', element: 'table' },
  { path: '/ar/admin/wallet/requests', title: 'طلبات المحفظة', category: 'admin', element: 'table' },
  { path: '/ar/admin/subscriptions', title: 'اشتراكات', category: 'admin', element: '[data-testid="subscriptions"]' },
  { path: '/ar/admin/reports', title: 'تقارير', category: 'admin', element: '[data-testid="reports"]' },
  { path: '/ar/admin/revenue', title: 'إيرادات', category: 'admin', element: '[data-testid="revenue"]' },
  { path: '/ar/admin/tenants', title: 'مستأجرين', category: 'admin', element: 'table' },
  { path: '/ar/admin/system', title: 'النظام', category: 'admin', element: '[data-testid="system-health"]' },
  { path: '/ar/admin/support', title: 'دعم فني', category: 'admin', element: '[data-testid="support"]' },
  { path: '/ar/admin/audit-log', title: 'سجل تدقيق', category: 'admin', element: 'table' },
];