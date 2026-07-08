'use client';

import Link from 'next/link';
import Navbar from '@/features/public/components/Navbar';
import Hero from '@/features/public/components/Hero';
import WhyUs from '@/features/public/components/WhyUs';
import Stats from '@/features/public/components/Stats';
import FeaturedListings from '@/features/listings/components/FeaturedListings';
import CTA from '@/features/public/components/CTA';

export default function PublicHomePage() {
  return (
    <main dir="rtl" className="min-h-screen text-[#111827] font-sans relative">
      
      {/* خلفية دمشق - ثابتة */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(/images/damascus-skyline.jpg)' }}
      />
      
      {/* طبقة بيضاء شفافة فوق الصورة - 30% */}
      <div className="fixed inset-0 bg-white/70 z-[1]" />

      {/* المحتوى */}
      <div className="relative z-10">
        <Navbar />
        <Hero />

        {/* فراغ */}
        <div className="py-6" />

        {/* أزرار الدخول والتسجيل */}
        <section className="py-8 px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/ar/auth/login"
              className="flex-1 bg-[#22C55E] text-white text-center py-4 px-8 rounded-[18px] text-lg font-semibold hover:bg-[#16A34A] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/ar/auth/register"
              className="flex-1 bg-white/30 backdrop-blur-md text-[#111827] text-center py-4 px-8 rounded-[18px] text-lg font-semibold border border-white/40 hover:border-[#22C55E] hover:text-[#22C55E] hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              تسجيل جديد
            </Link>
          </div>
        </section>

        {/* فراغ */}
        <div className="py-6" />

        {/* الإحصائيات */}
        <Stats />

        {/* فراغ */}
        <div className="py-6" />

        {/* إعلانات مميزة */}
        <FeaturedListings />

        {/* فراغ */}
        <div className="py-6" />

        {/* لماذا تختارنا */}
        <WhyUs />

        {/* فراغ */}
        <div className="py-6" />

        {/* دعوة لاتخاذ إجراء */}
        <CTA />
      </div>

    </main>
  );
}