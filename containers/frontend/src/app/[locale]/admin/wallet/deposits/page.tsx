'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ArrowDown, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDepositsPage() {
  const { accessToken } = useAuthStore();
  const [deposits, setDeposits] = useState([]);
  const headers = { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch('http://localhost:8080/api/wallet/admin/deposits', { headers }).then(r => r.json()).then(d => setDeposits(Array.isArray(d)?d:[])).catch(()=>{});
  }, []);

  const handleAction = async (id: string, action: string) => {
    await fetch('http://localhost:8080/api/wallet/admin/deposits/'+id+'/'+action, { method: 'POST', headers });
    setDeposits(deposits.filter((d: any) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans p-6"><div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pt-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"><ArrowDown size={20} className="text-white" /></div><h1 className="text-2xl font-bold">طلبات الإيداع</h1></div>
      <div className="space-y-3">
        {deposits.map((d: any) => (<div key={d.id} className="glass rounded-2xl p-4 border border-white/20 flex justify-between items-center">
          <div><p className="text-white font-medium">{d.amount} ل.س</p><p className="text-blue-200/60 text-sm">{d.user_id?.substring(0,8)}</p></div>
          <div className="flex gap-2"><button onClick={()=>handleAction(d.id,'approve')} className="bg-emerald-500 hover:bg-emerald-400 text-white p-2 rounded-xl"><CheckCircle size={18}/></button><button onClick={()=>handleAction(d.id,'reject')} className="bg-red-500 hover:bg-red-400 text-white p-2 rounded-xl"><XCircle size={18}/></button></div>
        </div>))}
        {deposits.length===0 && <p className="text-blue-200/40 text-center py-8">لا توجد طلبات إيداع</p>}
      </div>
    </div></div>
  );
}
