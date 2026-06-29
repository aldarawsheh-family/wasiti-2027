'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import DealTracker from '@/features/deals/components/DealTracker';
import Skeleton from '@/components/ui/Skeleton';
import { Handshake, Eye, EyeOff } from 'lucide-react';

type DealStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

type Deal = {
  id: string;
  title: string;
  listingTitle: string;
  buyerName: string;
  sellerName: string;
  buyer: string;
  seller: string;
  amount: number;
  status: DealStatus;
  currentStatus: DealStatus;
  date: string;
  statusHistory: {
    status: DealStatus;
    date: string;
    note?: string;
  }[];
};

export default function DealsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      title: 'سيارة تويوتا كورولا 2020',
      listingTitle: 'سيارة تويوتا كورولا 2020',
      buyerName: 'أحمد المحمد',
      sellerName: 'شركة وسيطي للتسويق',
      buyer: 'أحمد المحمد',
      seller: 'شركة وسيطي للتسويق',
      amount: 25000,
      status: 'PENDING',
      currentStatus: 'PENDING',
      date: '2026-01-15',
      statusHistory: [
        { status: 'PENDING', date: '2026-01-15', note: 'تم فتح الصفقة' },
      ],
    },
    {
      id: '2',
      title: 'شقة للبيع في المزة',
      listingTitle: 'شقة للبيع في المزة',
      buyerName: 'سارة عبدالله',
      sellerName: 'محمد علي',
      buyer: 'سارة عبدالله',
      seller: 'محمد علي',
      amount: 85000,
      status: 'IN_PROGRESS',
      currentStatus: 'IN_PROGRESS',
      date: '2026-01-10',
      statusHistory: [
        { status: 'PENDING', date: '2026-01-10', note: 'تم فتح الصفقة' },
        { status: 'ACCEPTED', date: '2026-01-11', note: 'تم القبول' },
        { status: 'IN_PROGRESS', date: '2026-01-12', note: 'بدأ التنفيذ' },
      ],
    },
    {
      id: '3',
      title: 'هاتف آيفون 15 برو',
      listingTitle: 'هاتف آيفون 15 برو',
      buyerName: 'نورا حسن',
      sellerName: 'أحمد المحمد',
      buyer: 'نورا حسن',
      seller: 'أحمد المحمد',
      amount: 3500,
      status: 'COMPLETED',
      currentStatus: 'COMPLETED',
      date: '2026-01-05',
      statusHistory: [
        { status: 'PENDING', date: '2026-01-05' },
        { status: 'ACCEPTED', date: '2026-01-06' },
        { status: 'IN_PROGRESS', date: '2026-01-07' },
        { status: 'COMPLETED', date: '2026-01-08' },
      ],
    },
    {
      id: '4',
      title: 'خدمة تصميم مواقع',
      listingTitle: 'خدمة تصميم مواقع',
      buyerName: 'أحمد المحمد',
      sellerName: 'سارة عبدالله',
      buyer: 'أحمد المحمد',
      seller: 'سارة عبدالله',
      amount: 500,
      status: 'CANCELLED',
      currentStatus: 'CANCELLED',
      date: '2025-12-28',
      statusHistory: [
        { status: 'PENDING', date: '2025-12-28' },
        { status: 'CANCELLED', date: '2025-12-29', note: 'تم الإلغاء من قبل المشتري' },
      ],
    },
  ]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const filteredDeals = deals.filter((deal) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return deal.status === 'PENDING';
    if (activeTab === 'active') return deal.status === 'ACCEPTED' || deal.status === 'IN_PROGRESS';
    if (activeTab === 'completed') return deal.status === 'COMPLETED';
    if (activeTab === 'cancelled') return deal.status === 'CANCELLED';
    return true;
  });

  const columns = [
    { key: 'title', label: 'الإعلان' },
    { key: 'buyer', label: 'المشتري' },
    { key: 'seller', label: 'البائع' },
    { key: 'amount', label: 'المبلغ' },
    { key: 'status', label: 'الحالة' },
    { key: 'date', label: 'التاريخ' },
    { key: 'actions', label: '' },
  ];

  const tableData = filteredDeals.map((deal) => ({
    title: <span className="font-medium text-white">{deal.listingTitle}</span>,
    buyer: <span className="text-blue-200/60">{deal.buyerName}</span>,
    seller: <span className="text-blue-200/60">{deal.sellerName}</span>,
    amount: <span className="font-bold text-sky-300">{deal.amount.toLocaleString()} ل.س</span>,
    status: (
      <Badge
        variant={
          deal.status === 'PENDING' ? 'warning' :
          deal.status === 'ACCEPTED' ? 'secondary' :
          deal.status === 'IN_PROGRESS' ? 'primary' :
          deal.status === 'COMPLETED' ? 'success' :
          'error'
        }
      >
        {deal.status === 'PENDING' ? 'معلقة' :
         deal.status === 'ACCEPTED' ? 'مقبولة' :
         deal.status === 'IN_PROGRESS' ? 'جارية' :
         deal.status === 'COMPLETED' ? 'مكتملة' :
         'ملغية'}
      </Badge>
    ),
    date: <span className="text-blue-200/60">{deal.date}</span>,
    actions: (
      <Button
        variant="glass"
        size="sm"
        onClick={() => setSelectedDealId(selectedDealId === deal.id ? null : deal.id)}
      >
        {selectedDealId === deal.id ? (
          <><EyeOff size={14} /> إخفاء</>
        ) : (
          <><Eye size={14} /> تفاصيل</>
        )}
      </Button>
    ),
  }));

  const selectedDeal = deals.find((d) => d.id === selectedDealId);

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

          <Tabs
            tabs={[
              { label: 'الكل', value: 'all' },
              { label: 'معلقة', value: 'pending' },
              { label: 'جارية', value: 'active' },
              { label: 'مكتملة', value: 'completed' },
              { label: 'ملغية', value: 'cancelled' },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="pills"
          />

          {loading ? (
            <Card className="p-4">
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="40px" />)}
              </div>
            </Card>
          ) : filteredDeals.length === 0 ? (
            <Card className="p-8 text-center">
              <Handshake size={48} className="text-blue-200/20 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white">لا توجد صفقات</h3>
              <p className="text-blue-200/40 text-sm">لا توجد صفقات في هذه الفئة</p>
            </Card>
          ) : (
            <Card className="p-0 overflow-hidden">
              <Table columns={columns} data={tableData} emptyMessage="لا توجد صفقات" />
            </Card>
          )}

          {selectedDeal && (
            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-bold text-white">تفاصيل الصفقة</h2>
              <DealTracker deal={selectedDeal} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}