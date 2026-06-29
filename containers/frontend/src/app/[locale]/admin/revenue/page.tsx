'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import { DollarSign, Building2, TrendingUp, Sparkles } from 'lucide-react';

export default function AdminRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'إجمالي المستأجرين', value: '0', icon: Building2, color: 'text-sky-300' },
    { label: 'اشتراكات نشطة', value: '0', icon: TrendingUp, color: 'text-violet-300' },
    { label: 'إعلانات نشطة', value: '0', icon: Sparkles, color: 'text-amber-300' },
    { label: 'صفقات مكتملة', value: '0', icon: DollarSign, color: 'text-emerald-300' },
  ]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:8080/api/tenants/').then(r => r.json()),
      fetch('http://localhost:8080/api/listings').then(r => r.json()),
      fetch('http://localhost:8080/api/deals/').then(r => r.json()),
    ])
    .then(([tenants, listings, deals]) => {
      const t = tenants?.data || tenants || [];
      const l = listings?.data || listings || [];
      const d = deals?.data || deals || [];
      setStats([
        { ...stats[0], value: String(Array.isArray(t) ? t.length : 0) },
        { ...stats[1], value: String(Array.isArray(t) ? t.filter((x: any) => x.is_active).length : 0) },
        { ...stats[2], value: String(Array.isArray(l) ? l.filter((x: any) => x.status === 'ACTIVE').length : 0) },
        { ...stats[3], value: String(Array.isArray(d) ? d.filter((x: any) => x.status === 'COMPLETED').length : 0) },
      ]);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-white">جاري التحميل...</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6"><Skeleton height="80px" /></Card>
              ))}
            </div>
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <DollarSign size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">الإيرادات المالية</h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 flex flex-col items-center justify-center gap-2 min-h-[120px] text-center" hover>
                <stat.icon size={28} className={stat.color} />
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-blue-200/50">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}