'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Skeleton from '@/components/ui/Skeleton';
import { Users, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

export default function AdminTenantsPage() {
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/tenants/')
      .then(r => r.json())
      .then(data => {
        const list = data?.data || data || [];
        setTenants(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch(() => {
        setTenants([]);
        setLoading(false);
      });
  }, []);

  const columns = [
    { key: 'name', label: 'اسم المستأجر' },
    { key: 'slug', label: 'Slug' },
    { key: 'type', label: 'نوع الاشتراك' },
    { key: 'status', label: 'الحالة' },
    { key: 'createdAt', label: 'تاريخ الإنشاء' },
    { key: 'actions', label: 'إجراءات' },
  ];

  const tableData = tenants.map((tenant) => ({
    name: <span className="font-medium text-white">{tenant.name || tenant.slug}</span>,
    slug: <span className="text-blue-200/50 text-sm">{tenant.slug}</span>,
    type: <Badge variant="secondary">{tenant.type || tenant.subscription || '—'}</Badge>,
    status: (
      <Badge variant={tenant.is_active ? 'success' : 'error'}>
        {tenant.is_active ? 'نشط' : 'غير نشط'}
      </Badge>
    ),
    createdAt: <span className="text-blue-200/60">{new Date(tenant.created_at).toLocaleDateString('ar')}</span>,
    actions: (
      <div className="flex gap-2">
        <Button variant="glass" size="sm">
          {tenant.is_active ? (
            <><ToggleRight size={14} /> تعطيل</>
          ) : (
            <><ToggleLeft size={14} /> تفعيل</>
          )}
        </Button>
        <Button variant="danger" size="sm">
          <Trash2 size={14} /> حذف
        </Button>
      </div>
    ),
  }));

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
              <Users size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">إدارة المستأجرين</h1>
          </div>

          <Card className="p-0 overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height="40px" />)}
              </div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8 text-blue-200/40">لا يوجد مستأجرين</div>
            ) : (
              <Table columns={columns} data={tableData} emptyMessage="لا يوجد مستأجرين" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}