'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { Building2, Package, Users, Handshake, Star } from 'lucide-react';

export default function CompanyDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'الإعلانات', value: '42', icon: Package, color: 'text-[var(--color-primary)]' },
    { label: 'الأعضاء', value: '12', icon: Users, color: 'text-[var(--color-accent)]' },
    { label: 'الصفقات', value: '28', icon: Handshake, color: 'text-[var(--color-success)]' },
    { label: 'التقييم', value: '4.8 ★', icon: Star, color: 'text-[var(--color-warning)]' },
  ];

  const recentListings = [
    { id: '1', title: 'سيارة تويوتا كورولا 2020', date: '2026-01-15', status: 'نشط' },
    { id: '2', title: 'شقة للبيع في المزة', date: '2026-01-10', status: 'نشط' },
    { id: '3', title: 'هاتف آيفون 15 برو', date: '2026-01-05', status: 'معلق' },
    { id: '4', title: 'خدمة تصميم مواقع', date: '2025-12-28', status: 'محذوف' },
  ];

  const recentMembers = [
    { name: 'أحمد المحمد', email: 'ahmed@example.com', joined: '2026-01-15', role: 'مدير' },
    { name: 'سارة عبدالله', email: 'sara@example.com', joined: '2026-01-10', role: 'مسوق' },
    { name: 'محمد علي', email: 'mohamed@example.com', joined: '2026-01-05', role: 'مندوب' },
  ];

  const listingColumns = [
    { key: 'title', label: 'العنوان' },
    { key: 'date', label: 'التاريخ' },
    { key: 'status', label: 'الحالة' },
  ];

  const listingData = recentListings.map((item) => ({
    title: <span className="font-medium text-white">{item.title}</span>,
    date: <span className="text-[var(--text-secondary)]">{item.date}</span>,
    status: <Badge variant={item.status === 'نشط' ? 'success' : item.status === 'معلق' ? 'warning' : 'error'}>{item.status}</Badge>,
  }));

  const memberColumns = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد الإلكتروني' },
    { key: 'joined', label: 'تاريخ الانضمام' },
    { key: 'role', label: 'الدور' },
  ];

  const memberData = recentMembers.map((item) => ({
    name: <span className="font-medium text-white">{item.name}</span>,
    email: <span className="text-[var(--text-secondary)]">{item.email}</span>,
    joined: <span className="text-[var(--text-secondary)]">{item.joined}</span>,
    role: <Badge variant="secondary">{item.role}</Badge>,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans relative">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pt-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center shadow-[var(--shadow-neon)]">
            <Building2 size={20} className="text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white">لوحة تحكم الشركة</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? [1,2,3,4].map((i) => <Card key={i}><Skeleton height="80px" /></Card>) : stats.map((s, i) => (
            <Card key={i} className="p-6 flex flex-col items-center justify-center gap-2 text-center" hover>
              <s.icon size={28} className={s.color} />
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{s.label}</div>
            </Card>
          ))}
        </div>

        <Card className="p-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Package size={18} className="text-[var(--color-primary)]" /> آخر الإعلانات</h2>
          {loading ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} height="40px" />)}</div> : <Table columns={listingColumns} data={listingData} emptyMessage="لا توجد إعلانات" />}
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users size={18} className="text-[var(--color-primary)]" /> آخر الأعضاء</h2>
          {loading ? <div className="space-y-3">{[1,2,3].map((i) => <Skeleton key={i} height="40px" />)}</div> : <Table columns={memberColumns} data={memberData} emptyMessage="لا يوجد أعضاء" />}
        </Card>
      </div>
    </div>
  );
}