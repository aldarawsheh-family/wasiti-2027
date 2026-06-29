'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Skeleton from '@/components/ui/Skeleton';
import { BarChart3, DollarSign, UserPlus, Package, Handshake, Activity } from 'lucide-react';

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'الإيرادات (شهرياً)', value: '0$', icon: DollarSign, color: 'text-emerald-300' },
    { label: 'مستخدمين جدد', value: '0', icon: UserPlus, color: 'text-sky-300' },
    { label: 'الإعلانات النشطة', value: '0', icon: Package, color: 'text-violet-300' },
    { label: 'الصفقات', value: '0', icon: Handshake, color: 'text-amber-300' },
  ]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:8080/api/listings').then(r => r.json()),
      fetch('http://localhost:8080/api/users/').then(r => r.json()),
      fetch('http://localhost:8080/api/deals/').then(r => r.json()),
    ])
    .then(([listings, users, deals]) => {
      const l = listings?.data || listings || [];
      const u = users?.data || users || [];
      const d = deals?.data || deals || [];
      setStats([
        { ...stats[0], value: '0$' },
        { ...stats[1], value: String(u.length) },
        { ...stats[2], value: String(Array.isArray(l) ? l.filter((i: any) => i.status === 'ACTIVE').length : 0) },
        { ...stats[3], value: String(Array.isArray(d) ? d.length : 0) },
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
              <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">التقارير والإحصائيات</h1>
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