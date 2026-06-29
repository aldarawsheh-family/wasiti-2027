'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Mail, KeyRound, Send, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1D3E66] text-white font-sans flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1D3E66] via-[#2A5783] to-[#12263A]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(103,232,249,0.35),transparent_70%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* الشريط العلوي */}
        <div className="sticky top-4 z-30 pt-2 pb-4">
          <div className="bg-white/25 backdrop-blur-xl border border-white/25 rounded-2xl px-4 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <button
              onClick={() => router.push('/ar/auth/login')}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors px-3 py-1 rounded-lg hover:bg-white/10"
            >
              <ArrowRight size={18} className="rotate-180" />
              <span className="text-sm font-medium">رجوع</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-300 to-blue-500 flex items-center justify-center border border-white/30">
                <KeyRound size={16} className="text-white" />
              </div>
              <span className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-white to-sky-200">نسيت كلمة المرور</span>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-8 border border-[var(--border-color)]">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-emerald-300" />
              </div>
              <h2 className="text-xl font-bold text-white">تم إرسال الرابط!</h2>
              <p className="text-blue-200/60 text-sm">تحقق من بريدك الإلكتروني واتبع التعليمات.</p>
              <Link href="/ar/auth/login">
                <Button variant="primary" className="mt-2">
                  العودة لتسجيل الدخول
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">نسيت كلمة المرور</h1>
                <p className="text-blue-200/60 text-sm mt-1">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="البريد الإلكتروني"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="أدخل بريدك الإلكتروني"
                  icon={<Mail size={16} />}
                  required
                />

                <Button type="submit" disabled={loading} size="lg" className="w-full">
                  <Send size={18} />
                  {loading ? 'جاري الإرسال...' : 'إرسال الرابط'}
                </Button>

                <div className="text-center text-sm text-blue-200/60">
                  <Link href="/ar/auth/login" className="text-sky-300 hover:text-sky-200 underline">
                    العودة لتسجيل الدخول
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}