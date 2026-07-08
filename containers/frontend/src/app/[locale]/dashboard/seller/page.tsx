'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, Handshake, DollarSign, Star, PlusSquare, Eye, Edit, TrendingUp } from 'lucide-react';

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('stats');

  const stats = [
    { label: 'إعلاناتي', value: '24', icon: Package, color: 'from-emerald-500 to-[#128C4F]' },
    { label: 'صفقات نشطة', value: '5', icon: Handshake, color: 'from-violet-500 to-purple-600' },
    { label: 'المبيعات', value: '12,400 ل.س', icon: DollarSign, color: 'from-amber-500 to-orange-600' },
    { label: 'التقييم', value: '4.9 ⭐', icon: Star, color: 'from-sky-500 to-blue-600' },
  ];

  const listings = [
    { id: '1', title: 'سيارة تويوتا كورولا 2020', price: 25000, status: 'نشط', views: 120 },
    { id: '2', title: 'شقة للبيع في المزة', price: 85000, status: 'نشط', views: 85 },
    { id: '3', title: 'هاتف آيفون 15 برو', price: 3500, status: 'معلق', views: 45 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-lg">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">لوحة تحكم التاجر</h1>
        </div>
        <Link href="/ar/publish" className="bg-[#128C4F] text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-md">
          <PlusSquare size={18} /> نشر إعلان
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition">
            <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 shadow-lg`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        {['stats', 'listings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'stats' ? 'الإحصائيات' : 'إعلاناتي'}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2"><Eye size={18} className="text-[#128C4F]" /> الأكثر مشاهدة</h3>
            <div className="space-y-3">
              {listings.map(item => (
                <div key={item.id} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600 text-sm">{item.title}</span>
                  <span className="text-gray-900 font-semibold text-sm">{item.views} 👁️</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 font-bold mb-4">أداء سريع</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-500">معدل التحويل</span><span className="text-emerald-600 font-bold">23%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">معدل الإلغاء</span><span className="text-red-500 font-bold">8%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">إجمالي المشاهدات</span><span className="text-gray-900 font-bold">1,430</span></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
          <div className="space-y-3">
            {listings.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-semibold">{item.title}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' :
                    item.status === 'معلق' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                  }`}>{item.status}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#128C4F] font-bold">{item.price.toLocaleString()} ل.س</span>
                  <Link href={`/ar/listing/${item.id}/edit`} className="text-gray-400 hover:text-[#128C4F] transition"><Edit size={16} /></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}