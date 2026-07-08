'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, PlusSquare, Upload, FileText, Tag, MapPin, List } from 'lucide-react';

const categories = ['سيارات', 'عقارات', 'موبايلات', 'خدمات', 'أثاث', 'وظائف'];
const cities = ['دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس'];

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', price: '', city: '', description: '', images: [] as File[] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title) errs.title = 'مطلوب';
    if (!formData.category) errs.category = 'مطلوب';
    if (!formData.price) errs.price = 'مطلوب';
    if (!formData.city) errs.city = 'مطلوب';
    if (!formData.description) errs.description = 'مطلوب';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push('/ar/dashboard'); }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">نشر إعلان جديد</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-md space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><FileText size={14} className="text-[#128C4F]" /> العنوان</label>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="عنوان الإعلان" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
          {errors.title && <span className="text-red-500 text-xs">{errors.title}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Tag size={14} className="text-[#128C4F]" /> السعر</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="ل.س" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
            {errors.price && <span className="text-red-500 text-xs">{errors.price}</span>}
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><MapPin size={14} className="text-[#128C4F]" /> المدينة</label>
            <input name="city" value={formData.city} onChange={handleChange} list="cities" placeholder="المدينة" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
            <datalist id="cities">{cities.map(c => <option key={c} value={c} />)}</datalist>
            {errors.city && <span className="text-red-500 text-xs">{errors.city}</span>}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><List size={14} className="text-[#128C4F]" /> الفئة</label>
          <select name="category" value={formData.category} onChange={handleChange} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] bg-white">
            <option value="">اختر الفئة</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <span className="text-red-500 text-xs">{errors.category}</span>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><FileText size={14} className="text-[#128C4F]" /> الوصف</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows={5} placeholder="وصف تفصيلي للإعلان" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] resize-none" />
          {errors.description && <span className="text-red-500 text-xs">{errors.description}</span>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-2"><Upload size={14} className="text-[#128C4F]" /> الصور</label>
          <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-4 py-4 cursor-pointer hover:border-[#128C4F] transition text-gray-400 text-sm">
            <Upload size={16} /> اختر صوراً
            <input type="file" multiple accept="image/*" className="hidden" />
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#128C4F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg">
          <PlusSquare size={18} /> {loading ? 'جاري النشر...' : 'نشر الإعلان'}
        </button>
      </form>
    </div>
  );
}