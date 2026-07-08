'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.push('/ar/public');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/ar/public');
    } catch (err: any) {
      setError(err?.message || 'فشل تسجيل الدخول');
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
            <LogIn size={28} className="text-[#22C55E]" />
          </div>
          <h1 className="text-3xl font-bold text-white">تسجيل الدخول</h1>
          <p className="text-white/50 text-sm mt-2">أهلاً بك مجدداً</p>
        </div>

        {/* خطأ */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm mb-4">{error}</div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* حقل البريد */}
          <div className="space-y-2">
            <label className="text-white font-bold text-sm">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              className="w-full h-[48px] bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 outline-none focus:border-[#22C55E] transition-all"
              required
            />
          </div>

          {/* حقل كلمة المرور */}
          <div className="space-y-2">
            <label className="text-white font-bold text-sm">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة مرورك"
              className="w-full h-[48px] bg-white/10 border border-white/20 rounded-xl px-4 text-white placeholder-white/40 outline-none focus:border-[#22C55E] transition-all"
              required
            />
          </div>

          {/* نسيت كلمة المرور */}
          <div className="text-left">
            <Link href="/ar/auth/forgot-password" className="text-sm text-white/70 hover:text-white transition-colors">
              نسيت كلمة المرور؟
            </Link>
          </div>

          {/* زر الدخول */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] bg-[#22C55E] hover:bg-[#1EA34E] text-white font-bold rounded-[18px] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>

          {/* رابط التسجيل */}
          <div className="text-center text-sm text-white/50">
            ليس لديك حساب؟{' '}
            <Link href="/ar/auth/register" className="text-white font-bold hover:underline">
              سجل الآن
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}