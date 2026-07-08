'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Save, Upload, Search, Users } from 'lucide-react';

export default function CompanySettingsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showInSearch, setShowInSearch] = useState(true);
  const [acceptExternal, setAcceptExternal] = useState(true);

  const [formData, setFormData] = useState({
    name: 'شركة وسيطي للتسويق',
    description: 'شركة رائدة في مجال التسويق العقاري والسيارات في سوريا.',
    logo: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); router.push('/ar/dashboard/company'); }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/ar/dashboard/company')} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">إعدادات الشركة</h1>
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Building2 size={18} className="text-[#128C4F]" /> معلومات الشركة
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">اسم الشركة</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">الوصف</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-2">شعار الشركة</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#128C4F]/10 flex items-center justify-center text-3xl font-extrabold text-[#128C4F]">
                    {formData.name[0]}
                  </div>
                  <label className="cursor-pointer flex items-center gap-2 border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-500 text-sm hover:border-[#128C4F] transition">
                    <Upload size={16} /> رفع شعار
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">الإعدادات العامة</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600"><Search size={16} /> إظهار الشركة في البحث</div>
                <button onClick={() => setShowInSearch(!showInSearch)} className={`w-12 h-7 rounded-full transition ${showInSearch ? 'bg-[#128C4F]' : 'bg-gray-300'}`}>
                  <span className={`block w-6 h-6 rounded-full bg-white shadow transition ${showInSearch ? 'mr-6' : 'mr-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2 text-gray-600"><Users size={16} /> استقبال طلبات خارجية</div>
                <button onClick={() => setAcceptExternal(!acceptExternal)} className={`w-12 h-7 rounded-full transition ${acceptExternal ? 'bg-[#128C4F]' : 'bg-gray-300'}`}>
                  <span className={`block w-6 h-6 rounded-full bg-white shadow transition ${acceptExternal ? 'mr-6' : 'mr-0'}`} />
                </button>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-[#128C4F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg">
            <Save size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </form>
      </div>
    </div>
  );
}