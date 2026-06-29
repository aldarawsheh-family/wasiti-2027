'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowRight, PlusSquare, Save, Upload, FileText, Tag, MapPin, List, ImageIcon } from 'lucide-react';

const categories = ['سيارات', 'عقارات', 'موبايلات', 'خدمات', 'أثاث', 'وظائف'];
const cities = ['دمشق', 'حلب', 'حمص', 'حماة', 'اللاذقية', 'طرطوس'];

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    city: '',
    description: '',
    images: [] as File[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, images: Array.from(e.target.files || []) }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = 'العنوان مطلوب';
    if (!formData.category) newErrors.category = 'الفئة مطلوبة';
    if (!formData.price) newErrors.price = 'السعر مطلوب';
    if (!formData.city) newErrors.city = 'المدينة مطلوبة';
    if (!formData.description) newErrors.description = 'الوصف مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      console.log('نشر الإعلان:', formData);
      router.push('/ar/dashboard/listings');
    } catch (error) {
      console.error('خطأ:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white pb-28 relative overflow-x-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto space-y-6">

        {/* شريط علوي */}
        <div className="sticky top-4 z-30 pt-2 pb-4">
          <div className="bg-white/25 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <Button variant="glass" size="sm" onClick={() => router.back()}>
              <ArrowRight size={18} className="rotate-180" /> رجوع
            </Button>
            <span className="font-bold text-sm text-white">إضافة إعلان جديد</span>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="العنوان"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="أدخل عنوان الإعلان"
              icon={<FileText size={16} />}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="السعر (ل.س)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="أدخل السعر"
                icon={<Tag size={16} />}
              />
              <Input
                label="المدينة"
                name="city"
                value={formData.city}
                onChange={handleChange}
                error={errors.city}
                placeholder="أدخل المدينة"
                icon={<MapPin size={16} />}
                list="cities"
              />
              <datalist id="cities">{cities.map(c => <option key={c} value={c} />)}</datalist>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-blue-100/90 flex items-center gap-2">
                <List size={16} className="text-sky-300" /> الفئة
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-sky-400 transition-all appearance-none"
              >
                <option value="">اختر الفئة</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="text-sm text-red-300">{errors.category}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-blue-100/90 flex items-center gap-2">
                <FileText size={16} className="text-sky-300" /> الوصف
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="أدخل وصفاً تفصيلياً للإعلان"
                className="w-full bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3.5 text-white placeholder:text-blue-300/50 outline-none focus:border-sky-400 transition-all resize-none"
              />
              {errors.description && <span className="text-sm text-red-300">{errors.description}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-blue-100/90 flex items-center gap-2">
                <ImageIcon size={16} className="text-sky-300" /> الصور
              </label>
              <label className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl px-4 py-3.5 cursor-pointer transition-colors">
                <Upload size={18} className="text-sky-300" />
                <span className="text-blue-100/80 text-sm">اختر صوراً</span>
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {formData.images.length > 0 && (
                <p className="text-sm text-blue-200/50">تم اختيار {formData.images.length} صورة</p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10">
              <Button type="submit" variant="primary" size="lg" className="flex-1" disabled={loading}>
                <PlusSquare size={18} /> {loading ? 'جاري النشر...' : 'نشر الإعلان'}
              </Button>
              <Button type="button" variant="glass" size="lg" className="flex-1" disabled={loading}>
                <Save size={18} /> حفظ كمسودة
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}