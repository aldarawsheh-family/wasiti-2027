'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, UserPlus, Edit, Trash2 } from 'lucide-react';

export default function CompanyMembersPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const members = [
    { id: '1', name: 'أحمد المحمد', email: 'ahmed@company.com', role: 'مدير', joined: '2026-01-15' },
    { id: '2', name: 'سارة عبدالله', email: 'sara@company.com', role: 'مسوق', joined: '2026-01-10' },
    { id: '3', name: 'محمد علي', email: 'mohamed@company.com', role: 'مندوب مبيعات', joined: '2026-01-05' },
    { id: '4', name: 'نورا حسن', email: 'nora@company.com', role: 'مدير حسابات', joined: '2025-12-28' },
  ];

  if (loading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded-2xl w-64"></div>
          {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
            <Users size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">أعضاء الشركة</h1>
            <p className="text-gray-500 mt-0.5">{members.length} أعضاء</p>
          </div>
        </div>
        <Link href="/ar/dashboard/company/members/invite" className="bg-[#128C4F] text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-lg">
          <UserPlus size={18} /> دعوة عضو جديد
        </Link>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">العضو</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden md:table-cell">البريد</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">الدور</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden lg:table-cell">التاريخ</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#128C4F]/10 flex items-center justify-center text-[#128C4F] font-bold text-sm">
                        {m.name[0]}
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{m.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{m.role}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">{m.joined}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-xl text-gray-400 hover:text-[#128C4F] hover:bg-[#128C4F]/5 transition"><Edit size={16} /></button>
                      <button className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}