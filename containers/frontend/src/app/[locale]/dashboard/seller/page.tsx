'use client';

import { useState } from 'react';
import Link from 'next/link';
import Toast from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Tabs from '@/components/ui/Tabs';
import { Package, Handshake, DollarSign, Star, PlusSquare, Eye, Edit } from 'lucide-react';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('stats');
  const [showToast, setShowToast] = useState(false);

  const stats = [
    { label: 'إعلاناتي', value: '24', icon: Package, color: 'text-[var(--color-primary)]' },
    { label: 'صفقات قيد التنفيذ', value: '5', icon: Handshake, color: 'text-[var(--color-accent)]' },
    { label: 'إجمالي المبيعات', value: '12,400 ل.س', icon: DollarSign, color: 'text-[var(--color-success)]' },
    { label: 'التقييم', value: '4.9 ⭐', icon: Star, color: 'text-[var(--color-warning)]' },
  ];

  const listings = [
    { id: '1', title: 'سيارة تويوتا كورولا 2020', price: 25000, status: 'نشط', views: 120 },
    { id: '2', title: 'شقة للبيع في المزة', price: 85000, status: 'نشط', views: 85 },
    { id: '3', title: 'هاتف آيفون 15 برو', price: 3500, status: 'معلق', views: 45 },
    { id: '4', title: 'خدمة تصميم مواقع', price: 500, status: 'محذوف', views: 12 },
  ];

  const deals = [
    { id: '1', buyer: 'أحمد المحمد', amount: 25000, status: 'قيد التنفيذ', date: '2026-01-15' },
    { id: '2', buyer: 'سارة عبدالله', amount: 85000, status: 'مكتملة', date: '2026-01-10' },
    { id: '3', buyer: 'محمد علي', amount: 3500, status: 'ملغية', date: '2026-01-05' },
  ];

  return (
    <div className="space-y-6">
      {showToast && <Toast message="تم تحديث البيانات بنجاح!" type="success" onClose={() => setShowToast(false)} />}

      <div className="flex items-center justify-between pt-2">
        <h1 className="text-3xl font-bold text-white">لوحة تحكم التاجر</h1>
        <Link href="/ar/publish"><Button variant="primary"><PlusSquare size={18} /> نشر إعلان</Button></Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 flex flex-col items-center justify-center gap-2 text-center" hover>
            <stat.icon size={28} className={stat.color} />
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Tabs tabs={[{ label: 'الإحصائيات', value: 'stats' }, { label: 'إعلاناتي', value: 'listings' }, { label: 'صفقاتي', value: 'deals' }]} activeTab={activeTab} onTabChange={setActiveTab} variant="pills" />

      <div className="space-y-4">
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Eye size={18} className="text-[var(--color-primary)]" /> الأكثر مشاهدة</h3>
              <div className="space-y-2">
                {listings.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] text-sm">{item.title}</span>
                    <span className="text-white text-sm">{item.views} 👁️</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Handshake size={18} className="text-[var(--color-primary)]" /> آخر الصفقات</h3>
              <div className="space-y-2">
                {deals.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-[var(--border-color)]">
                    <span className="text-[var(--text-secondary)] text-sm">{item.buyer}</span>
                    <Badge variant={item.status === 'قيد التنفيذ' ? 'primary' : item.status === 'مكتملة' ? 'success' : 'error'}>{item.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-white font-bold mb-4">أداء سريع</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">معدل التحويل</span><span className="text-[var(--color-success)] font-bold">23%</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">معدل الإلغاء</span><span className="text-[var(--color-error)] font-bold">8%</span></div>
                <div className="flex justify-between"><span className="text-[var(--text-secondary)]">إجمالي المشاهدات</span><span className="text-white font-bold">1,430</span></div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'listings' && (
          <Card className="p-6">
            <div className="space-y-3">
              {listings.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{item.title}</span>
                    <Badge variant={item.status === 'نشط' ? 'success' : item.status === 'معلق' ? 'warning' : 'error'}>{item.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--color-primary)] font-bold">{item.price.toLocaleString()} ل.س</span>
                    <Link href={`/ar/listing/${item.id}/edit`}><Button variant="glass" size="sm"><Edit size={14} /> تعديل</Button></Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'deals' && (
          <Card className="p-6">
            <div className="space-y-3">
              {deals.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{item.buyer}</span>
                    <Badge variant={item.status === 'قيد التنفيذ' ? 'primary' : item.status === 'مكتملة' ? 'success' : 'error'}>{item.status}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[var(--color-primary)] font-bold">{item.amount.toLocaleString()} ل.س</span>
                    <Button variant="glass" size="sm">تفاصيل</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}