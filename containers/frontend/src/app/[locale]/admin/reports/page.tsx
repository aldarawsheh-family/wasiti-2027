'use client';
import { BarChart3, FileText, Download } from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    { title: 'تقرير المستخدمين', desc: 'إحصائيات المستخدمين والنشاط', icon: BarChart3 },
    { title: 'تقرير الإعلانات', desc: 'أداء الإعلانات والمشاهدات', icon: FileText },
    { title: 'تقرير المبيعات', desc: 'الصفقات والإيرادات', icon: Download },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#128C4F] to-emerald-600 flex items-center justify-center shadow-xl shadow-[#128C4F]/30">
          <BarChart3 size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">التقارير</h1>
          <p className="text-gray-500 mt-0.5">تقارير وإحصائيات المنصة</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-[#128C4F]/30 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-[#128C4F]/10 flex items-center justify-center mb-4">
              <r.icon size={24} className="text-[#128C4F]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{r.title}</h3>
            <p className="text-gray-500 text-sm">{r.desc}</p>
            <button className="mt-4 w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-[#128C4F] hover:text-white transition-all">
              عرض التقرير
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}