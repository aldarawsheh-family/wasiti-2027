'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Shield, Activity } from 'lucide-react';

export default function AdminWalletPage() {
  const { accessToken } = useAuthStore();
  const [settlements, setSettlements] = useState([]);

  const headers = {
    'Authorization': 'Bearer ' + accessToken,
    'tenant-id': '00000000-0000-0000-0000-000000000001',
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/wallet/admin/settlements', { headers })
      .then(r => r.json())
      .then(data => setSettlements(data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pt-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">إدارة المحافظ</h1>
        </div>

        <div className="glass rounded-2xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-sky-300" />
            <h2 className="font-bold">التسويات</h2>
          </div>
          <div className="space-y-2">
            {settlements.map((s: any) => (
              <div key={s.id} className="flex justify-between text-sm bg-white/5 p-2 rounded-lg">
                <span>{s.settlement_type}</span>
                <span className="text-sky-300">{s.net_amount}</span>
                <span className={s.status === 'GENERATED' ? 'text-green-400' : 'text-red-400'}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
