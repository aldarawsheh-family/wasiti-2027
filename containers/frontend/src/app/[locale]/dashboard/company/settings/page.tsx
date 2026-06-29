'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { ArrowRight, Building2, Save, Upload, Search, Users } from 'lucide-react';
import Switch from '@/components/ui/Switch';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => setFormData((prev) => ({ ...prev, logo: event.target?.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'اسم الشركة مطلوب';
    if (!formData.description) newErrors.description = 'الوصف مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try { console.log('حفظ:', formData); router.push('/ar/dashboard/company'); }
    catch (error) { console.error('خطأ:', error); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans relative">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center pt-2">
          <Button variant="glass" size="sm" onClick={() => router.push('/ar/dashboard/company')}>
            <ArrowRight size={18} className="rotate-180" /> رجوع
          </Button>
          <span className="font-bold text-white">إعدادات الشركة</span>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-[var(--color-primary)]" /> معلومات الشركة
              </h2>
              <div className="space-y-4">
                <Input label="اسم الشركة" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="أدخل اسم الشركة" />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">الوصف</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] resize-none" placeholder="أدخل وصفاً للشركة" />
                  {errors.description && <span className="text-sm text-red-300">{errors.description}</span>}
                </div>
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] block mb-3">شعار الشركة</label>
                  <div className="flex items-center gap-4">
                    <Avatar src={formData.logo} name={formData.name} size="lg" className="w-20 h-20 text-2xl" />
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-[var(--border-color)] rounded-xl px-4 py-2.5 transition-colors">
                        <Upload size={16} className="text-[var(--color-primary)]" />
                        <span className="text-sm text-[var(--text-secondary)]">رفع شعار</span>
                      </div>
                      <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)]">
              <h2 className="text-lg font-bold text-white mb-4">الإعدادات العامة</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Search size={16} className="text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-secondary)]">إظهار الشركة في البحث</span>
                  </div>
                  <Switch checked={showInSearch} onChange={setShowInSearch} />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[var(--text-secondary)]" />
                    <span className="text-[var(--text-secondary)]">استقبال طلبات خارجية</span>
                  </div>
                  <Switch checked={acceptExternal} onChange={setAcceptExternal} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)]">
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={saving}>
                <Save size={18} /> {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}