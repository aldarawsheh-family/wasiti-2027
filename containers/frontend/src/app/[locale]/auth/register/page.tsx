'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
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
      setError(err?.message || 'فشل إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white font-sans flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* خلفية */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0 scale-125"
        style={{ backgroundImage: 'url(/images/login-bg.jpg)' }}
      />
      
      {/* طبقة تظليل */}
      <div className="fixed inset-0 bg-black/40 z-[1]" />

      {/* كارد زجاجي شفاف */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-sm rounded-[24px] p-8 border border-white/20 shadow-2xl">
        
        {/* الشعار */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4 border-2 border-[#22C55E]/30">
            <UserPlus size={28} className="text-[#22C55E]" />
          </div>
          <h1 className="text-3xl font-bold text-white">إنشاء حساب جديد</h1>
          <p className="text-white/50 text-sm mt-2">انضم إلى مجتمع وسيط</p>
        </div>

        {/* رسائل */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl text-sm mb-4">{success}</div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <label className="text-white font-bold text-sm">الاسم الكامل</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="أدخل اسمك الكامل" className="w-full h-[48px] bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 outline-none focus:border-[#22C55E] transition-all" required />
          </div>

          <div className="space-y-2">
            <label className="text-white font-bold text-sm">رقم الهاتف</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="أدخل رقم هاتفك" className="w-full h-[48px] bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 outline-none focus:border-[#22C55E] transition-all" required />
          </div>

          <div className="space-y-2">
            <label className="text-white font-bold text-sm">البريد الإلكتروني</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="أدخل بريدك الإلكتروني" className="w-full h-[48px] bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 outline-none focus:border-[#22C55E] transition-all" required />
          </div>

          <div className="space-y-2">
            <label className="text-white font-bold text-sm">كلمة المرور</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="أدخل كلمة مرورك" className="w-full h-[48px] bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 outline-none focus:border-[#22C55E] transition-all" required />
          </div>

          <div className="space-y-2">
            <label className="text-white font-bold text-sm">تأكيد كلمة المرور</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="أعد كتابة كلمة المرور" className="w-full h-[48px] bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 outline-none focus:border-[#22C55E] transition-all" required />
          </div>

          <button type="submit" disabled={loading} className="w-full h-[52px] bg-[#22C55E] hover:bg-[#1EA34E] text-white font-bold rounded-[18px] transition-all duration-300 disabled:opacity-50">
            {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
          </button>

          <div className="text-center text-sm text-white/50">
            لديك حساب بالفعل؟{' '}
            <Link href="/ar/auth/login" className="text-white font-bold hover:underline">
              سجل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}