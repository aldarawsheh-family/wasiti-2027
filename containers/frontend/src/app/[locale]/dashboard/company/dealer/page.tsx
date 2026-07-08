'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Package, Users, Handshake, Star, Plus } from 'lucide-react';

export default function DealerDashboardPage() {
  const { accessToken } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    // جلب dealer profile + clients
    Promise.all([
      fetch('/api/dealer/4de13da5-c5f8-4bd6-85bd-1204a1d00c7c/profile', {
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
      }).then(r => r.json()),
      fetch('/api/dealer/4de13da5-c5f8-4bd6-85bd-1204a1d00c7c/clients', {
        headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': '00000000-0000-0000-0000-000000000001', 'user-role': 'COMPANY_ADMIN' }
      }).then(r => r.json()),
    ]).then(([p, c]) => {
      setProfile(p);
      setClients(Array.isArray(c) ? c : []);
      setLoading(false);
    });
  }, [accessToken]);

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-2xl w-64"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <Package size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">لوحة المعرض</h1>
          <p className="text-gray-500 mt-0.5">إدارة المعرض والعملاء</p>
        </div>
      </div>

      {/* Profile Card */}
      {profile && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">معلومات المعرض</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">التخصص</span>
              <p className="text-gray-900 font-semibold">{profile.specialty === 'vehicles' ? 'سيارات' : profile.specialty === 'real_estate' ? 'عقارات' : 'كلاهما'}</p>
            </div>
            <div>
              <span className="text-gray-400">العنوان</span>
              <p className="text-gray-900 font-semibold">{profile.office_address || '—'}</p>
            </div>
            <div>
              <span className="text-gray-400">رقم الرخصة</span>
              <p className="text-gray-900 font-semibold">{profile.license_number || '—'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Clients */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Users size={18} className="text-[#128C4F]" /> العملاء ({clients.length})
          </h2>
          <button className="bg-[#128C4F] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 hover:bg-emerald-700 transition">
            <Plus size={16} /> إضافة عميل
          </button>
        </div>
        {clients.length === 0 ? (
          <p className="text-gray-400 text-center py-4">لا يوجد عملاء بعد</p>
        ) : (
          <div className="space-y-3">
            {clients.map((c: any) => (
              <div key={c.user_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#128C4F]/10 flex items-center justify-center text-[#128C4F] font-bold text-sm">
                    {(c.display_name || c.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{c.display_name || c.email}</p>
                    <p className="text-gray-400 text-xs">{c.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}