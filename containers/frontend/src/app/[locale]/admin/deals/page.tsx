'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Handshake, Eye, XCircle } from 'lucide-react';

export default function AdminDealsPage() {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState<any[]>([]);
  const tenantId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    fetch('/api/deals', {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
    })
      .then(r => r.json())
      .then(data => {
        const list = data?.data || data || [];
        setDeals(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch(() => {
        setDeals([]);
        setLoading(false);
      });
  }, [accessToken]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
      ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
      IN_PROGRESS: 'bg-violet-50 text-violet-700 border-violet-200',
      COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CANCELLED: 'bg-red-50 text-red-700 border-red-200',
    };
    const labels: Record<string, string> = {
      PENDING: 'معلقة',
      ACCEPTED: 'مقبولة',
      IN_PROGRESS: 'جارية',
      COMPLETED: 'مكتملة',
      CANCELLED: 'ملغية',
    };
    return (
      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PENDING}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <Handshake size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">إدارة الصفقات</h1>
          <p className="text-gray-500 mt-0.5">{deals.length} صفقة</p>
        </div>
      </div>

      {/* Table */}
      {deals.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
            <Handshake size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-400 font-medium">لا توجد صفقات</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">المنتج</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">المشتري</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden md:table-cell">البائع</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">المبلغ</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">الحالة</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden lg:table-cell">التاريخ</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 text-sm">
                      {deal.listing_title || deal.id?.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {deal.buyer_id?.substring(0, 8) || '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs hidden md:table-cell">
                      {deal.seller_id?.substring(0, 8) || '—'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">
                      {deal.offer_price ? deal.offer_price.toLocaleString() + ' ل.س' : '—'}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(deal.status)}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">
                      {new Date(deal.created_at).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-xl text-gray-400 hover:text-[#128C4F] hover:bg-[#128C4F]/5 transition" title="عرض">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition" title="إلغاء">
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}