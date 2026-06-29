'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import Skeleton from '@/components/ui/Skeleton';
import { Calendar, DollarSign, Star, ClipboardList } from 'lucide-react';

export default function BookingDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }, []);

  const stats = [
    { label: 'حجوزات اليوم', value: '12', icon: Calendar, color: 'text-[var(--color-primary)]' },
    { label: 'الإيرادات', value: '1,250,000 ل.س', icon: DollarSign, color: 'text-[var(--color-success)]' },
    { label: 'التقييم', value: '4.8 ★', icon: Star, color: 'text-[var(--color-warning)]' },
    { label: 'حجوزات نشطة', value: '34', icon: ClipboardList, color: 'text-[var(--color-accent)]' },
  ];

  const bookings = [
    { id: 'BK-001', customer: 'أحمد المحمد', service: 'فندق الشام', date: '2026-01-20', status: 'قادم', price: 85000 },
    { id: 'BK-002', customer: 'سارة عبدالله', service: 'رحلة إلى اللاذقية', date: '2026-01-18', status: 'قادم', price: 35000 },
    { id: 'BK-003', customer: 'محمد علي', service: 'مطعم قصر الأندلس', date: '2026-01-15', status: 'مكتمل', price: 25000 },
    { id: 'BK-004', customer: 'نورا حسن', service: 'فندق داما روز', date: '2026-01-10', status: 'مكتمل', price: 120000 },
    { id: 'BK-005', customer: 'خالد سعيد', service: 'رحلة إلى اللاذقية', date: '2026-01-05', status: 'ملغي', price: 35000 },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'upcoming') return b.status === 'قادم';
    if (activeTab === 'completed') return b.status === 'مكتمل';
    if (activeTab === 'cancelled') return b.status === 'ملغي';
    return true;
  });

  const columns = [
    { key: 'id', label: 'رقم الحجز' },
    { key: 'customer', label: 'العميل' },
    { key: 'service', label: 'الخدمة' },
    { key: 'date', label: 'التاريخ' },
    { key: 'status', label: 'الحالة' },
    { key: 'price', label: 'السعر' },
  ];

  const tableData = filteredBookings.map((b) => ({
    id: <span className="font-medium text-white">{b.id}</span>,
    customer: <span className="text-[var(--text-secondary)]">{b.customer}</span>,
    service: <span className="text-[var(--text-secondary)]">{b.service}</span>,
    date: <span className="text-[var(--text-secondary)]">{b.date}</span>,
    status: <Badge variant={b.status === 'قادم' ? 'primary' : b.status === 'مكتمل' ? 'success' : 'error'}>{b.status}</Badge>,
    price: <span className="font-bold text-[var(--color-primary)]">{b.price.toLocaleString()} ل.س</span>,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans relative">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white pt-4">لوحة تحكم الحجوزات</h1>
        <p className="text-[var(--text-secondary)] text-sm">إدارة ومتابعة جميع الحجوزات</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading ? [1,2,3,4].map((i) => <Card key={i}><Skeleton height="80px" /></Card>) : stats.map((s, i) => (
            <Card key={i} className="p-6 flex flex-col items-center justify-center gap-2" hover>
              <s.icon size={28} className={s.color} />
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-[var(--text-secondary)]">{s.label}</div>
            </Card>
          ))}
        </div>

        <Tabs tabs={[{ label: 'قادمة', value: 'upcoming' }, { label: 'مكتملة', value: 'completed' }, { label: 'ملغية', value: 'cancelled' }]} activeTab={activeTab} onTabChange={setActiveTab} variant="pills" />

        <Card className="p-4">
          {loading ? <div className="space-y-3">{[1,2,3,4].map((i) => <Skeleton key={i} height="40px" />)}</div> :
           filteredBookings.length === 0 ? <div className="text-center py-8 text-[var(--text-secondary)]">لا توجد حجوزات</div> :
           <Table columns={columns} data={tableData} emptyMessage="لا توجد حجوزات" />}
        </Card>
      </div>
    </div>
  );
}