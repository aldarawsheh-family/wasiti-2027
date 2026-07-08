'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Users, Handshake, Building2, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const { accessToken } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    listings: 0,
    users: 0,
    deals: 0,
    companies: 0,
    pendingWallet: 0,
  });

  const tenantId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    if (!accessToken) return;
    const headers = { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId };

    Promise.all([
      fetch('/api/listings', { headers }).then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/users', { headers }).then(r => r.json()).catch(() => []),
      fetch('/api/deals', { headers }).then(r => r.json()).catch(() => []),
      fetch('/api/companies', { headers }).then(r => r.json()).catch(() => []),
      fetch('/api/wallet/requests?status=PENDING', { headers }).then(r => r.json()).catch(() => []),
    ]).then(([listings, users, deals, companies, pending]) => {
      setStats({
        listings: listings.data?.length || listings.length || 0,
        users: Array.isArray(users) ? users.length : 0,
        deals: Array.isArray(deals) ? deals.length : 0,
        companies: Array.isArray(companies) ? companies.length : 0,
        pendingWallet: Array.isArray(pending) ? pending.length : 0,
      });
      setLoading(false);
    });
  }, [accessToken]);

  const statCards = [
    {
      value: stats.users,
      label: 'مستخدم',
      sublabel: 'العدد الإجمالي',
      icon: Users,
      bgGradient: 'from-emerald-50 to-green-50',
      iconBg: 'from-emerald-500 to-[#128C4F]',
      textColor: 'text-emerald-700',
      href: '/ar/admin/users',
    },
    {
      value: stats.listings,
      label: 'إعلان',
      sublabel: 'نشط',
      icon: Package,
      bgGradient: 'from-sky-50 to-blue-50',
      iconBg: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-700',
      href: '/ar/admin/listings',
    },
    {
      value: stats.deals,
      label: 'صفقة',
      sublabel: 'مكتملة',
      icon: Handshake,
      bgGradient: 'from-violet-50 to-purple-50',
      iconBg: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-700',
      href: '/ar/admin/deals',
    },
    {
      value: stats.companies,
      label: 'شركة',
      sublabel: 'مسجلة',
      icon: Building2,
      bgGradient: 'from-amber-50 to-orange-50',
      iconBg: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-700',
      href: '/ar/admin/tenants',
    },
    {
      value: stats.pendingWallet,
      label: 'طلبات معلقة',
      sublabel: 'تحتاج مراجعة',
      icon: Wallet,
      bgGradient: 'from-rose-50 to-red-50',
      iconBg: 'from-rose-500 to-red-500',
      textColor: 'text-rose-700',
      href: '/ar/admin/wallet/requests',
    },
    {
      value: 'قريباً',
      label: 'الإيرادات',
      sublabel: 'تقرير مالي',
      icon: TrendingUp,
      bgGradient: 'from-teal-50 to-cyan-50',
      iconBg: 'from-teal-500 to-cyan-600',
      textColor: 'text-teal-700',
      href: '/ar/admin/revenue',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
            <LayoutDashboard size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">لوحة التحكم</h1>
            <p className="text-gray-500 mt-0.5">نظرة عامة على المنصة</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          جميع الخدمات شغالة
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            onClick={() => stat.href && router.push(stat.href)}
            className={`group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 ${stat.href ? 'cursor-pointer hover:border-[#128C4F]/20 hover:-translate-y-1' : ''}`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center shadow-lg`}>
                  <stat.icon size={22} className="text-white" />
                </div>
                {stat.href && (
                  <ArrowUpRight size={18} className="text-gray-300 group-hover:text-[#128C4F] transition-colors" />
                )}
              </div>
              <p className="text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
              <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sublabel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}