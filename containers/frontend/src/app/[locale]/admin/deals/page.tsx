'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Handshake, Eye, XCircle } from 'lucide-react';

export default function AdminDealsPage() {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8080/api/deals/')
      .then(r => r.json())
      .then(data => {
        const list = data?.data || data || [];
        setDeals(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch(() => {
        setDeals([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white">جاري التحميل...</h1>
            <Card className="p-4">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="40px" />)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const columns = [
    { key: 'title', label: 'العنوان' },
    { key: 'buyer', label: 'المشتري' },
    { key: 'seller', label: 'البائع' },
    { key: 'amount', label: 'المبلغ' },
    { key: 'status', label: 'الحالة' },
    { key: 'date', label: 'التاريخ' },
    { key: 'actions', label: 'إجراءات' },
  ];

  const tableData = deals.map((deal) => ({
    title: <span className="font-medium text-white">{deal.listing_title || deal.id?.substring(0, 8)}</span>,
    buyer: <span className="text-blue-200/60">{deal.buyer_id?.substring(0, 8) || '—'}</span>,
    seller: <span className="text-blue-200/60">{deal.seller_id?.substring(0, 8) || '—'}</span>,
    amount: <span className="font-bold text-sky-300">{deal.offer_price ? deal.offer_price.toLocaleString() + ' ل.س' : '—'}</span>,
    status: (
      <Badge
        variant={
          deal.status === 'PENDING' ? 'warning' :
          deal.status === 'ACCEPTED' || deal.status === 'IN_PROGRESS' ? 'primary' :
          deal.status === 'COMPLETED' ? 'success' :
          'error'
        }
      >
        {deal.status === 'PENDING' ? 'معلقة' :
         deal.status === 'ACCEPTED' ? 'مقبولة' :
         deal.status === 'IN_PROGRESS' ? 'جارية' :
         deal.status === 'COMPLETED' ? 'مكتملة' :
         deal.status === 'CANCELLED' ? 'ملغية' : deal.status}
      </Badge>
    ),
    date: <span className="text-blue-200/60">{new Date(deal.created_at).toLocaleDateString('ar')}</span>,
    actions: (
      <div className="flex gap-2">
        <Button variant="glass" size="sm">
          <Eye size={14} /> عرض
        </Button>
        <Button variant="danger" size="sm">
          <XCircle size={14} /> إلغاء
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
              <Handshake size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">إدارة الصفقات</h1>
          </div>

          <Card className="p-0 overflow-hidden">
            {deals.length === 0 ? (
              <div className="text-center py-8 text-blue-200/40">لا توجد صفقات</div>
            ) : (
              <Table columns={columns} data={tableData} emptyMessage="لا توجد صفقات" />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}