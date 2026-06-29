'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowRight, Handshake, FileText, User, DollarSign, MessageSquare } from 'lucide-react';

export default function CreateDealPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ listing: '', buyer: '', amount: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.listing) newErrors.listing = 'الإعلان مطلوب';
    if (!formData.buyer) newErrors.buyer = 'المشتري مطلوب';
    if (!formData.amount) newErrors.amount = 'عرض السعر مطلوب';
    if (parseFloat(formData.amount) <= 0) newErrors.amount = 'عرض السعر يجب أن يكون أكبر من صفر';
    if (!formData.message) newErrors.message = 'الرسالة مطلوبة';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { console.log('بدء صفقة:', formData); router.push('/ar/dashboard/deals'); }
    catch (error) { console.error('خطأ:', error); }
    finally { setLoading(false); }
  };

  const selectClass = "w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition-all appearance-none";

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans relative">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center pt-2">
          <Button variant="glass" size="sm" onClick={() => router.back()}><ArrowRight size={18} className="rotate-180" /> رجوع</Button>
          <span className="font-bold text-white">بدء صفقة جديدة</span>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2"><FileText size={16} className="text-[var(--color-primary)]" /> الإعلان</label>
              <select name="listing" value={formData.listing} onChange={handleChange} className={selectClass}>
                <option value="">اختر الإعلان</option>
                <option value="1">سيارة تويوتا كورولا 2020</option>
                <option value="2">شقة للبيع في المزة</option>
                <option value="3">هاتف آيفون 15 برو</option>
              </select>
              {errors.listing && <span className="text-sm text-red-300">{errors.listing}</span>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2"><User size={16} className="text-[var(--color-primary)]" /> المشتري</label>
              <select name="buyer" value={formData.buyer} onChange={handleChange} className={selectClass}>
                <option value="">اختر المشتري</option>
                <option value="أحمد المحمد">أحمد المحمد</option>
                <option value="سارة عبدالله">سارة عبدالله</option>
                <option value="محمد علي">محمد علي</option>
              </select>
              {errors.buyer && <span className="text-sm text-red-300">{errors.buyer}</span>}
            </div>

            <Input label="عرض السعر (ل.س)" name="amount" type="number" value={formData.amount} onChange={handleChange} error={errors.amount} placeholder="أدخل عرض السعر" />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2"><MessageSquare size={16} className="text-[var(--color-primary)]" /> الرسالة</label>
              <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-white placeholder:text-[var(--text-secondary)] outline-none focus:border-[var(--color-primary)] resize-none" placeholder="أدخل رسالتك للمشتري" />
              {errors.message && <span className="text-sm text-red-300">{errors.message}</span>}
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}><Handshake size={20} /> {loading ? 'جاري الإرسال...' : 'إرسال العرض'}</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}