'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, UserPlus, Users } from 'lucide-react';

export default function InviteMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', role: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.email) errs.email = 'البريد الإلكتروني مطلوب';
    else if (!formData.email.includes('@')) errs.email = 'بريد إلكتروني غير صالح';
    if (!formData.role) errs.role = 'الدور مطلوب';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push('/ar/dashboard/company/members'); }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/ar/dashboard/company/members')} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">دعوة عضو جديد</h1>
      </div>

      <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Mail size={16} className="text-[#128C4F]" /> البريد الإلكتروني</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="أدخل بريد العضو" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
            {errors.email && <span className="text-sm text-red-500 mt-1 block">{errors.email}</span>}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Users size={16} className="text-[#128C4F]" /> الدور</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] bg-white">
              <option value="">اختر الدور</option>
              <option value="مدير">مدير</option>
              <option value="مسوق">مسوق</option>
              <option value="مندوب مبيعات">مندوب مبيعات</option>
              <option value="مدير حسابات">مدير حسابات</option>
            </select>
            {errors.role && <span className="text-sm text-red-500 mt-1 block">{errors.role}</span>}
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#128C4F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg">
            <UserPlus size={18} /> {loading ? 'جاري الإرسال...' : 'إرسال الدعوة'}
          </button>
        </form>
      </div>
    </div>
  );
}