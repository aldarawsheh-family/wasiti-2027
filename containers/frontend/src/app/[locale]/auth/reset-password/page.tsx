'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, ShieldCheck } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمة المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--bg-dark)] text-white font-sans flex justify-center relative">
      <div className="w-full max-w-[430px] relative px-4 pt-12 flex items-center justify-center min-h-screen">

        <div className="w-full bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)]">

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-emerald-300" />
              </div>
              <h2 className="text-xl font-bold text-white">تم إعادة التعيين!</h2>
              <p className="text-[var(--text-secondary)] text-sm">يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
              <Link href="/ar/auth/login">
                <Button variant="primary" className="mt-2">تسجيل الدخول</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-neon)]">
                  <Lock size={24} className="text-black" />
                </div>
                <h1 className="text-2xl font-bold text-white">إعادة تعيين كلمة المرور</h1>
                <p className="text-[var(--text-secondary)] text-sm mt-1">أدخل كلمة مرور جديدة لحسابك</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-3 rounded-xl text-sm mb-4">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="كلمة المرور الجديدة" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة مرور جديدة" required />
                <Input label="تأكيد كلمة المرور" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="أعد كتابة كلمة المرور" required />

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                  {loading ? 'جاري إعادة التعيين...' : 'إعادة تعيين'}
                </Button>

                <div className="text-center text-sm text-[var(--text-secondary)]">
                  <Link href="/ar/auth/login" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] underline transition-colors">
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}