'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function AdminEscrowPage() {
  const { accessToken } = useAuthStore();
  const [disputes, setDisputes] = useState([]);
  const headers = { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'Content-Type': 'application/json' };

  useEffect(() => {
    fetch('http://localhost:8080/api/wallet/admin/escrow/disputes', { headers }).then(r => r.json()).then(d => setDisputes(Array.isArray(d)?d:[])).catch(()=>{});
  }, []);

  const handleResolve = async (id: string, action: string) => {
    await fetch('http://localhost:8080/api/wallet/escrow/'+action+'/'+id, { method: 'POST', headers });
    setDisputes(disputes.filter((d: any) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans p-6"><div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pt-4"><div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center"><AlertTriangle size={20} className="text-white" /></div><h1 className="text-2xl font-bold">نزاعات Escrow</h1></div>
      <div className="space-y-3">
        {disputes.map((d: any) => (<div key={d.id} className="glass rounded-2xl p-4 border border-white/20">
          <div className="flex justify-between mb-2"><span className="text-sky-300 font-bold">{d.amount} {d.currency}</span><span className="text-red-400">نزاع</span></div>
          <p className="text-blue-200/60 text-sm">مشتري: {d.buyer_wallet_id?.substring(0,8)} | بائع: {d.seller_wallet_id?.substring(0,8)}</p>
          <div className="flex gap-2 mt-3"><button onClick={()=>handleResolve(d.id,'release')} className="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"><ArrowRight size={14}/> للبائع</button><button onClick={()=>handleResolve(d.id,'refund')} className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"><ArrowLeft size={14}/> للمشتري</button></div>
        </div>))}
        {disputes.length===0 && <p className="text-blue-200/40 text-center py-8">لا توجد نزاعات</p>}
      </div>
    </div></div>
  );
}
