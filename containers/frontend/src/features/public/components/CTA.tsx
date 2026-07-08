'use client';

import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        
        <div className="bg-white/10 backdrop-blur-xl rounded-[24px] p-8 md:p-12 border border-white/50 shadow-sm">
          <h2 className="text-3xl font-bold text-[#111827] mb-4 drop-shadow-sm">
            انضم إلى آلاف المستخدمين الراضين
          </h2>
          <p className="text-[#6B7280] text-lg mb-8 max-w-2xl mx-auto">
            انضم إلى مجتمع وسيط اليوم وابدأ في بيع وشراء كل ما تريد بسهولة وأمان
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link
              href="/ar/publish"
              className="bg-[#22C55E] text-white font-bold px-8 py-4 rounded-[18px] hover:bg-[#16A34A] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md text-center"
            >
              نشر إعلانك الآن
            </Link>
            <Link
              href="/ar/search"
              className="bg-white/80 backdrop-blur-md text-[#111827] font-bold px-8 py-4 rounded-[18px] border border-[#E5E7EB] hover:border-[#22C55E] hover:text-[#22C55E] hover:-translate-y-1 transition-all duration-300 shadow-sm text-center"
            >
              تصفح الإعلانات
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}