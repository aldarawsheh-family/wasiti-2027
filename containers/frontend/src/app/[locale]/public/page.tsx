'use client';

import Link from 'next/link';
import FeaturedListings from '@/features/listings/components/FeaturedListings';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans pb-28 relative overflow-x-hidden">

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        <div className="text-center mb-12 mt-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[var(--color-primary)] to-white bg-clip-text text-transparent">
            WASITI
          </h1>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)]">
            سوقك السوري الأول - بيع واشتري بسهولة
          </p>
        </div>

        <div className="w-full max-w-7xl mb-16">
          <FeaturedListings />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link
            href="/auth/login"
            className="flex-1 bg-gradient-to-r from-[var(--color-primary)] to-[#11998e] text-black text-center py-4 px-8 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-[var(--shadow-neon)]"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/auth/register"
            className="flex-1 bg-[var(--bg-card)] hover:bg-white/10 border border-[var(--border-color)] text-white text-center py-4 px-8 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            تسجيل جديد
          </Link>
        </div>

      </div>
    </div>
  );
}