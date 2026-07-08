'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Building2, Hotel, Truck, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';

export default function EnterpriseDashboardPage() {
  const { accessToken, user } = useAuthStore();
  const [company, setCompany] = useState<any>(null);
  const [stats, setStats] = useState({ properties: 0, vehicles: 0, products: 0, clients: 0 });
  const [loading, setLoading] = useState(true);

  const tenantId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    if (!accessToken) return;
    const headers = { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId, 'user-id': user?.id || '' };

    fetch('/api/companies/my-company', { headers })
      .then(r => r.json())
      .then(c => {
        setCompany(c);
        if (!c?.id) { setLoading(false); return; }

        return Promise.all([
          fetch(`/api/booking/${c.id}/properties`, { headers }).then(r => r.json()),
          fetch(`/api/transport/${c.id}/vehicles`, { headers }).then(r => r.json()),
          fetch(`/api/shop/${c.id}/products`, { headers }).then(r => r.json()),
          fetch(`/api/dealer/${c.id}/clients`, { headers }).then(r => r.json()),
        ]);
      })
      .then((results) => {
        if (results) {
          setStats({
            properties: Array.isArray(results[0]) ? results[0].length : 0,
            vehicles: Array.isArray(results[1]) ? results[1].length : 0,
            products: Array.isArray(results[2]) ? results[2].length : 0,
            clients: Array.isArray(results[3]) ? results[3].length : 0,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [accessToken]);

  const cards = [
    { label: 'الفنادق', value: stats.properties, icon: Hotel, color: 'from-amber-500 to-orange-600', href: '/ar/dashboard/company/booking' },
    { label: 'المركبات', value: stats.vehicles, icon: Truck, color: 'from-sky-500 to-blue-600', href: '/ar/dashboard/company/transport' },
    { label: 'المنتجات', value: stats.products, icon: ShoppingBag, color: 'from-violet-500 to-purple-600', href: '/ar/dashboard/company/shop' },
    { label: 'العملاء', value: stats.clients, icon: Users, color: 'from-emerald-500 to-[#128C4F]', href: '/ar/dashboard/company/dealer' },
  ];

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-10 h-10 border-4 border-[#128C4F] border-t-transparent rounded-full animate-spin" /></div>;

  if (!company) return (
    <div className="p-16 text-center">
      <Building2 size={48} className="text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500">لا توجد شركة مرتبطة بهذا الحساب</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <Building2 size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">{company.name}</h1>
          <p className="text-gray-500 mt-0.5">{company.tenant_type} • لوحة التحكم الشاملة</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <Link key={i} href={c.href} className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md hover:border-[#128C4F]/30 transition cursor-pointer">
            <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 shadow-lg`}>
              <c.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}