'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth.store';
import { LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.push('/ar/public/home');
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/ar/public/home');
    } catch (err: any) {
      setError(err?.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-primary)] font-sans flex items-center justify-center px-4">

      <div className="w-full max-w-md glass rounded-2xl p-8 border border-[var(--border-color)]">

        {/* رأس النموذج */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">تسجيل الدخول</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">أهلاً بك مجدداً</p>
        </div>

        {/* رسالة خطأ */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-sm mb-4">{error}</div>
        )}

        {/* النموذج */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            required
          />

          <Input
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="أدخل كلمة مرورك"
            required
          />

          <div className="text-left">
            <Link href="/ar/auth/forgot-password" className="text-xs text-sky-300/70 hover:text-sky-200">
              نسيت كلمة المرور؟
            </Link>
          </div>

          <Button type="submit" disabled={loading} size="lg" className="w-full">
            {loading ? 'جاري تسجيل الدخول...' : 'دخول'}
          </Button>

          <div className="text-center text-sm text-[var(--text-secondary)]">
            ليس لديك حساب؟{' '}
            <Link href="/ar/auth/register" className="text-sky-300 hover:text-sky-200 underline">
              سجل الآن
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}