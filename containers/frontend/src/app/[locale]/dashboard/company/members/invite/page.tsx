'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowRight, Mail, UserPlus, Users } from 'lucide-react';

export default function InviteMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ email: '', role: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!formData.email.includes('@')) newErrors.email = 'بريد إلكتروني غير صالح';
    if (!formData.role) newErrors.role = 'الدور مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      console.log('إرسال الدعوة:', formData);
      router.push('/ar/dashboard/company/members');
    } catch (error) {
      console.error('خطأ:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans relative">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center pt-2">
          <Button variant="glass" size="sm" onClick={() => router.push('/ar/dashboard/company/members')}>
            <ArrowRight size={18} className="rotate-180" /> رجوع
          </Button>
          <span className="font-bold text-white">دعوة عضو جديد</span>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="أدخل بريد العضو الإلكتروني" />
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
                <Users size={16} className="text-[var(--color-primary)]" /> الدور
              </label>
              <select name="role" value={formData.role} onChange={handleChange} className="w-full bg-[var(--bg-input)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-white outline-none focus:border-[var(--color-primary)] transition-all">
                <option value="">اختر الدور</option>
                <option value="مدير">مدير</option>
                <option value="مسوق">مسوق</option>
                <option value="مندوب مبيعات">مندوب مبيعات</option>
                <option value="مدير حسابات">مدير حسابات</option>
              </select>
              {errors.role && <span className="text-sm text-red-300">{errors.role}</span>}
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
              <UserPlus size={18} /> {loading ? 'جاري الإرسال...' : 'إرسال الدعوة'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}