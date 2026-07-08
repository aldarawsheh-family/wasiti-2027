'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Package, Users, Handshake, Star } from 'lucide-react';

export default function CompanyDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { label: 'الإعلانات', value: '42', icon: Package, color: 'from-emerald-500 to-[#128C4F]' },
    { label: 'الأعضاء', value: '12', icon: Users, color: 'from-violet-500 to-purple-600' },
    { label: 'الصفقات', value: '28', icon: Handshake, color: 'from-amber-500 to-orange-600' },
    { label: 'التقييم', value: '4.8 ⭐', icon: Star, color: 'from-sky-500 to-blue-600' },
  ];

  const recentListings = [
    { title: 'سيارة تويوتا كورولا 2020', date: '2026-01-15', status: 'نشط' },
    { title: 'شقة للبيع في المزة', date: '2026-01-10', status: 'نشط' },
    { title: 'هاتف آيفون 15 برو', date: '2026-01-05', status: 'معلق' },
  ];

  const recentMembers = [
    { name: 'أحمد المحمد', email: 'ahmed@example.com', role: 'مدير' },
    { name: 'سارة عبدالله', email: 'sara@example.com', role: 'مسوق' },
    { name: 'محمد علي', email: 'mohamed@example.com', role: 'مندوب' },
  ];

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-2xl w-64"></div>
          <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <Building2 size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">لوحة تحكم الشركة</h1>
          <p className="text-gray-500 mt-0.5">نظرة عامة على أداء الشركة</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm hover:shadow-md transition">
            <div className={`w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
              <s.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Listings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Package size={18} className="text-[#128C4F]" /> آخر الإعلانات
        </h2>
        <div className="space-y-3">
          {recentListings.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-900 font-semibold text-sm">{item.title}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-xs">{item.date}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.status === 'نشط' ? 'bg-emerald-50 text-emerald-700' :
                  item.status === 'معلق' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
                }`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Members */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={18} className="text-[#128C4F]" /> آخر الأعضاء
        </h2>
        <div className="space-y-3">
          {recentMembers.map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <span className="text-gray-900 font-semibold text-sm">{item.name}</span>
                <p className="text-gray-400 text-xs">{item.email}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{item.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}