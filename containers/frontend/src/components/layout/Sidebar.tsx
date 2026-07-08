'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { LayoutDashboard, Package, Handshake, Users, Wallet, Settings, User, TrendingUp, Building2, Headphones, Shield, BarChart3, DollarSign, CreditCard, Activity } from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
}

const allItems: SidebarItem[] = [
  { label: 'الملف الشخصي', href: '/ar/dashboard/profile', icon: <User size={18} />, roles: ['USER', 'SELLER', 'COMPANY_ADMIN'] },
  { label: 'إعلاناتي', href: '/ar/dashboard', icon: <Package size={18} />, roles: ['USER', 'SELLER', 'COMPANY_ADMIN'] },
  { label: 'محفظتي', href: '/ar/dashboard/wallet', icon: <Wallet size={18} />, roles: ['USER', 'SELLER', 'COMPANY_ADMIN'] },
  { label: 'لوحة التاجر', href: '/ar/dashboard/seller', icon: <TrendingUp size={18} />, roles: ['SELLER', 'COMPANY_ADMIN'] },
  { label: 'لوحة الشركة', href: '/ar/dashboard/company', icon: <Building2 size={18} />, roles: ['COMPANY_ADMIN'] },
  { label: 'أعضاء الشركة', href: '/ar/dashboard/company/members', icon: <Users size={18} />, roles: ['COMPANY_ADMIN'] },
  { label: 'الإعدادات', href: '/ar/dashboard/settings', icon: <Settings size={18} />, roles: ['USER', 'SELLER', 'COMPANY_ADMIN'] },
];

const supportItems: SidebarItem[] = [
  { label: 'الرئيسية', href: '/ar/admin', icon: <LayoutDashboard size={18} />, roles: [] },
  { label: 'المستخدمين', href: '/ar/admin/users', icon: <Users size={18} />, roles: [] },
  { label: 'الدعم', href: '/ar/admin/support', icon: <Headphones size={18} />, roles: [] },
];

const adminItems: SidebarItem[] = [
  { label: 'الرئيسية', href: '/ar/admin', icon: <LayoutDashboard size={18} />, roles: [] },
  { label: 'المستخدمين', href: '/ar/admin/users', icon: <Users size={18} />, roles: [] },
  { label: 'الإعلانات', href: '/ar/admin/listings', icon: <Package size={18} />, roles: [] },
  { label: 'الصفقات', href: '/ar/admin/deals', icon: <Handshake size={18} />, roles: [] },
  { label: 'المستأجرين', href: '/ar/admin/tenants', icon: <Building2 size={18} />, roles: [] },
  { label: 'المحافظات', href: '/ar/admin/wallet/requests', icon: <Wallet size={18} />, roles: [] },
  { label: 'الاشتراكات', href: '/ar/admin/subscriptions', icon: <CreditCard size={18} />, roles: [] },
  { label: 'التقارير', href: '/ar/admin/reports', icon: <BarChart3 size={18} />, roles: [] },
  { label: 'الإيرادات', href: '/ar/admin/revenue', icon: <DollarSign size={18} />, roles: [] },
  { label: 'النظام', href: '/ar/admin/system', icon: <Activity size={18} />, roles: [] },
  { label: 'الدعم', href: '/ar/admin/support', icon: <Headphones size={18} />, roles: [] },
  { label: 'سجل التدقيق', href: '/ar/admin/audit-log', icon: <Shield size={18} />, roles: [] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const adminRoles = ['PLATFORM_OWNER', 'ADMIN'];
  const supportRoles = ['SUPPORT', 'MODERATOR'];
  const isAdmin = user && adminRoles.includes(user.role);
  const isSupport = user && supportRoles.includes(user.role);

  const items = isAdmin ? adminItems 
    : isSupport ? supportItems 
    : allItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <aside className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-60 bg-white border-l border-gray-200 shadow-sm overflow-y-auto z-40">
      <div className="flex flex-col gap-1 p-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-[#128C4F] text-white font-bold shadow-md shadow-[#128C4F]/20'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}