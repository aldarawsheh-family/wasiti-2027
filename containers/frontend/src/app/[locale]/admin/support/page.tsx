'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Headphones, MessageSquare, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

export default function AdminSupportPage() {
  const { accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);
  const [filter, setFilter] = useState('OPEN');
  const tenantId = '00000000-0000-0000-0000-000000000001';

  useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    fetch('/api/notifications', {
      headers: { 'Authorization': 'Bearer ' + accessToken, 'tenant-id': tenantId }
    })
      .then(r => r.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setTickets([]);
        setLoading(false);
      });
  }, [accessToken]);

  const stats = {
    open: tickets.length,
    closed: 0,
    pending: 0,
  };

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-2xl w-64"></div>
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl"></div>)}
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
            <Headphones size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">الدعم الفني</h1>
            <p className="text-gray-500 mt-0.5">{tickets.length} تذكرة</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'مفتوحة', value: stats.open, icon: MessageSquare, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700' },
          { label: 'مغلقة', value: stats.closed, icon: CheckCircle, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-700' },
          { label: 'قيد المعالجة', value: stats.pending, icon: Clock, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50', text: 'text-blue-700' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon size={22} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Headphones size={40} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">لا توجد تذاكر دعم</p>
          <p className="text-gray-400 text-sm mt-1">ستظهر هنا تذاكر الدعم الفني من المستخدمين</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket, i) => (
            <div key={ticket.id || i} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <MessageSquare size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{ticket.title || ticket.message || 'تذكرة دعم'}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{new Date(ticket.created_at).toLocaleDateString('ar-SA')}</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  مفتوحة
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}