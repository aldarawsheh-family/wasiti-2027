'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { LayoutDashboard, Package, Users, Handshake, Building2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const [stats, setStats] = useState([
    { value: '0', label: 'إعلانات', icon: Package, color: 'text-sky-300' },
    { value: '0', label: 'مستخدمين', icon: Users, color: 'text-violet-300' },
    { value: '0', label: 'صفقات', icon: Handshake, color: 'text-emerald-300' },
    { value: '0', label: 'شركات', icon: Building2, color: 'text-amber-300' },
]);

useEffect(() => {
    fetchData();
}, []);

const fetchData = async () => {
    try {
        const [listings, users, deals, companies] = await Promise.all([
            fetch('http://localhost:8080/api/listings').then(r => r.json()),
            fetch('http://localhost:8080/api/users/').then(r => r.json()),
            fetch('http://localhost:8080/api/deals/').then(r => r.json()),
            fetch('http://localhost:8080/api/companies/').then(r => r.json()),
        ]);
        setStats([
            { ...stats[0], value: listings?.data?.length || listings?.length || '0' },
            { ...stats[1], value: users?.data?.length || users?.length || '0' },
            { ...stats[2], value: deals?.data?.length || deals?.length || '0' },
            { ...stats[3], value: companies?.data?.length || companies?.length || '0' },
        ]);
    } catch (err) {
        console.log('Admin KPIs:', err.message);
    }
};
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1D3E66] flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200/60">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-400/30 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* العنوان */}
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">لوحة تحكم المالك</h1>
          </div>

          {/* الإحصائيات */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 flex flex-col items-center justify-center gap-2 text-center" hover>
                <stat.icon size={28} className={stat.color} />
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-blue-200/50">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}