'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { DollarSign } from 'lucide-react';

export default function AdminCommissionsPage() {
  const { accessToken } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, count: 0 });
  const headers = { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch('http://localhost:8080/api/wallet/admin/commissions', { headers }).then(r => r.json()).then(d => setStats(d)).catch(()=>{});
  }, []);

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans p-6"><div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pt-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center"><DollarSign size={20} className="text-white" /></div><h1 className="text-2xl font-bold">العمولات</h1></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6 border border-white/20 text-center"><p className="text-blue-200/60 text-sm">إجمالي العمولات</p><p className="text-3xl font-bold text-amber-300 mt-2">{stats.total} ل.س</p></div>
        <div className="glass rounded-2xl p-6 border border-white/20 text-center"><p className="text-blue-200/60 text-sm">عدد العمليات</p><p className="text-3xl font-bold text-sky-300 mt-2">{stats.count}</p></div>
      </div>
    </div></div>
  );
}
