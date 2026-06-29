'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setTimeout(() => {
        setVerified(true);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <main dir="rtl" className="min-h-screen bg-[var(--bg-dark)] text-white font-sans flex justify-center relative">
      <div className="w-full max-w-[430px] relative px-4 pt-12 flex items-center justify-center min-h-screen">

        <div className="w-full bg-[var(--bg-card)] rounded-2xl p-8 border border-[var(--border-color)]">

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center mx-auto mb-4 shadow-[var(--shadow-neon)]">
              <Mail size={24} className="text-black" />
            </div>
            <h1 className="text-2xl font-bold text-white">تأكيد البريد الإلكتروني</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">تم إرسال رابط تأكيد إلى بريدك الإلكتروني</p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[var(--text-secondary)]">جاري تأكيد البريد الإلكتروني...</p>
            </div>
          ) : verified ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-emerald-300" />
              </div>
              <h2 className="text-xl font-bold text-white">تم التأكيد!</h2>
              <p className="text-[var(--text-secondary)] text-sm">بريدك الإلكتروني مؤكد بنجاح.</p>
              <Link href="/ar/auth/login">
                <Button variant="primary" className="mt-2">تسجيل الدخول</Button>
              </Link>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/30 flex items-center justify-center mx-auto">
                <XCircle size={32} className="text-red-300" />
              </div>
              <h2 className="text-xl font-bold text-white">الرابط غير صالح</h2>
              <p className="text-[var(--text-secondary)] text-sm">الرابط غير صالح أو منتهي الصلاحية.</p>
              <Button variant="primary" size="lg" className="w-full" onClick={() => alert('سيتم إعادة إرسال رابط التأكيد.')}>
                <RefreshCw size={18} /> إعادة إرسال الرابط
              </Button>
              <div className="text-sm text-[var(--text-secondary)]">
                <Link href="/ar/auth/login" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] underline transition-colors">
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}