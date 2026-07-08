'use client';

import { Shield } from 'lucide-react';

export default function AdminAuditLogPage() {
  const logs = [
    { action: 'تغيير دور مستخدم', user: 'admin@test.com', target: 'buyer@test.com', date: '2026-07-03', status: 'نجاح' },
    { action: 'حذف إعلان', user: 'admin@test.com', target: 'إعلان #123', date: '2026-07-02', status: 'نجاح' },
    { action: 'الموافقة على إيداع', user: 'admin@test.com', target: 'محفظة #456', date: '2026-07-02', status: 'نجاح' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <Shield size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">سجل التدقيق</h1>
          <p className="text-gray-500 mt-0.5">سجل العمليات الحساسة</p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">العملية</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">المستخدم</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden md:table-cell">المستهدف</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase hidden lg:table-cell">التاريخ</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-gray-400 uppercase">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{log.action}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{log.user}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm hidden md:table-cell">{log.target}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm hidden lg:table-cell">{log.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {log.status}
                    </span>
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