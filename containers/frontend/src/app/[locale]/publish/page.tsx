
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createListing } from '@/features/listings/api/listings';
import { useAuthStore } from '@/stores/auth.store';
import { ArrowRight, UploadCloud, X, MapPin, Tag, FileText, Image as ImageIcon, PlusSquare, List } from 'lucide-react';

const categories = ['سيارات', 'عقارات', 'موبايلات', 'خدمات', 'أثاث', 'وظائف'];

export default function PublishPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({ title: '', price: '', city: '', category: '', description: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createListing({ title: formData.title, category: formData.category || 'أخرى', price: Number(formData.price), city: formData.city, description: formData.description, imageUrl: '' });
      router.push('/ar');
    } catch (err: any) { setError(err?.message || 'فشل نشر الإعلان'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/ar')} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">نشر إعلان</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-md space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><FileText size={14} className="text-[#128C4F]" /> العنوان</label>
          <input required placeholder="عنوان الإعلان" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><Tag size={14} className="text-[#128C4F]" /> السعر</label>
            <input type="number" required placeholder="ل.س" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F]" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><MapPin size={14} className="text-[#128C4F]" /> المدينة</label>
            <select required value={formData.city} onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] bg-white">
              <option value="">اختر</option>
              <option value="دمشق">دمشق</option><option value="حلب">حلب</option><option value="حمص">حمص</option><option value="حماة">حماة</option><option value="اللاذقية">اللاذقية</option><option value="طرطوس">طرطوس</option>
            </select>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><List size={14} className="text-[#128C4F]" /> الفئة</label>
          <select required value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] bg-white">
            <option value="">اختر</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-1"><FileText size={14} className="text-[#128C4F]" /> الوصف</label>
          <textarea required rows={5} placeholder="تفاصيل الإعلان" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-[#128C4F] resize-none" />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm text-gray-500 mb-2"><ImageIcon size={14} className="text-[#128C4F]" /> الصور</label>
          {imagePreviews.length === 0 ? (
            <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl p-8 cursor-pointer hover:border-[#128C4F] transition text-gray-400 text-sm">
              <UploadCloud size={32} className="text-gray-300" />
              <span>اسحب الصور هنا أو اضغط للرفع</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {imagePreviews.map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden border-2 border-gray-200">
                  <img src={img} alt="" className="w-full h-32 object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"><X size={14} /></button>
                </div>
              ))}
              <label className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center cursor-pointer hover:border-[#128C4F] transition h-32">
                <PlusSquare size={24} className="text-gray-300" />
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-[#128C4F] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-lg">
          <PlusSquare size={18} /> {loading ? 'جاري النشر...' : 'نشر الإعلان الآن'}
        </button>
      </form>
    </div>
  );
}