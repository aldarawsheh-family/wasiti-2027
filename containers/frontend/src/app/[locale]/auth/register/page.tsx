'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { ApiError } from '@/lib/errors';
import { UserPlus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      setSuccess('✅ تم إنشاء الحساب بنجاح. جاري التحويل...');
      setTimeout(() => router.push('/ar/auth/login'), 1500);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 409) {
        setError('الإيميل مستخدم. يرجى إنشاء حساب جديد');
      } else if (err?.message) {
        setError(err.message);
      } else {
        setError('فشل إنشاء الحساب. حاول مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)] font-sans flex justify-center relative">
      <div className="w-full max-w-[430px] relative px-4 pt-8 flex items-center justify-center min-h-screen">

        <div className="w-full bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)]">

          {/* رأس النموذج */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-neon)]">
              <UserPlus size={24} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">إنشاء حساب</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">ابدأ رحلتك معنا</p>
          </div>

          {/* رسائل */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-sm mb-4">{error}</div>
          )}
          {success && (
            <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 p-3 rounded-xl text-sm mb-4">{success}</div>
          )}

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-sm text-white font-medium">نوع الحساب</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full bg-[var(--bg-input)] text-white border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:border-[var(--color-primary)] transition-all"
              >
                <option value="user">مستخدم عادي (مشتري)</option>
                <option value="seller">تاجر (بائع)</option>
                <option value="company">شركة (مؤسسة)</option>
              </select>
            </div>

            <Input label="الاسم الكامل" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="أدخل اسمك الكامل" required />
            <Input label="رقم الهاتف" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="أدخل رقم هاتفك" required />
            <Input label="البريد الإلكتروني" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="أدخل بريدك الإلكتروني" required />
            <Input label="كلمة المرور" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="أدخل كلمة مرورك" required />
            <Input label="تأكيد كلمة المرور" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="أعد كتابة كلمة المرور" required />

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>

            <div className="text-center text-sm text-[var(--text-secondary)]">
              لديك حساب بالفعل؟{' '}
              <Link href="/ar/auth/login" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] underline transition-colors">
                سجل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}