'use client';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';

export default function AdminRevenuePage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <DollarSign size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">الإيرادات</h1>
          <p className="text-gray-500 mt-0.5">الإيرادات والعمولات</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'إجمالي الإيرادات', value: '0 ل.س', icon: DollarSign },
          { label: 'عمولات الصفقات', value: '0 ل.س', icon: TrendingUp },
          { label: 'رسوم الاشتراكات', value: '0 ل.س', icon: Wallet },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#128C4F]/10 flex items-center justify-center mb-4">
              <s.icon size={24} className="text-[#128C4F]" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}