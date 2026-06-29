'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { CreditCard, Calendar } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/tenants/')
      .then(r => r.json())
      .then(data => {
        const list = data?.data || data || [];
        setSubscriptions(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch(() => {
        setSubscriptions([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: 'name', label: 'المستأجر' },
    { key: 'type', label: 'النوع' },
    { key: 'subscription', label: 'الخطة' },
    { key: 'status', label: 'الحالة' },
    { key: 'users', label: 'المستخدمين' },
  ];

  const tableData = subscriptions.map((sub) => ({
    name: <span className="font-medium text-white">{sub.name || sub.slug || '—'}</span>,
    type: <span className="text-blue-200/60">{sub.type || '—'}</span>,
    subscription: <span className="text-blue-200/60">{sub.subscription || '—'}</span>,
    status: (
      <Badge variant={sub.is_active ? 'success' : 'error'}>
        {sub.is_active ? 'نشط' : 'غير نشط'}
      </Badge>
    ),
    users: (
      <span className="text-blue-200/60 flex items-center gap-1">
        {sub.max_users || 0} / {sub.max_listings || 0} إعلان
      </span>
    ),
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white">جاري التحميل...</h1>
            <Card className="p-4">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="40px" />)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <CreditCard size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">إدارة الاشتراكات</h1>
          </div>

          <Card className="p-0 overflow-hidden">
            {subscriptions.length === 0 ? (
              <div className="text-center py-8 text-blue-200/40">لا توجد اشتراكات</div>
            ) : (
              <Table columns={columns} data={tableData} emptyMessage="لا توجد اشتراكات" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}