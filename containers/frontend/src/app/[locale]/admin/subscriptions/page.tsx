'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { CreditCard, Users, Package, Building2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminSubscriptionsPage() {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState<any[]>([]);
  const tenantId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    fetch('/api/tenants', {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
    })
      .then(r => r.json())
      .then(data => {
        const list = data?.data || data || [];
        setTenants(Array.isArray(list) ? list : []);
        setLoading(false);
      })
      .catch(() => {
        setTenants([]);
        setLoading(false);
      });
  }, [accessToken]);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-2xl w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
            <Building2 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">المستأجرين والاشتراكات</h1>
            <p className="text-gray-500 mt-0.5">{tenants.length} مستأجر</p>
          </div>
        </div>
      </div>

      {/* List */}
      {tenants.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Building2 size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">لا يوجد مستأجرين</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tenants.map((tenant, i) => (
            <div
              key={tenant.id || i}
              className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-md hover:shadow-xl hover:border-[#128C4F]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  tenant.is_active ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {tenant.is_active ? (
                    <CheckCircle size={24} className="text-emerald-600" />
                  ) : (
                    <XCircle size={24} className="text-red-500" />
                  )}
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  tenant.is_active
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tenant.is_active ? '● نشط' : '● موقوف'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {tenant.name || tenant.slug || 'مستأجر'}
              </h3>

              <div className="space-y-3 bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">النوع</span>
                  <span className="text-gray-900 font-semibold text-sm">{tenant.type || 'عادي'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">الخطة</span>
                  <span className="text-gray-900 font-semibold text-sm">{tenant.subscription || 'مجانية'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-sm">المستخدمين</span>
                  <span className="text-gray-900 font-semibold text-sm">{tenant.max_users || '—'}</span>
                </div>
              </div>

              <button className="w-full mt-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-[#128C4F] hover:text-white transition-all duration-200">
                إدارة الاشتراك
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}