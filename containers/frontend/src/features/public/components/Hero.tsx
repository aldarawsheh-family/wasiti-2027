'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

const quickLinks = ['سيارات', 'عقارات', 'أجهزة', 'خدمات'];

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ar/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative pt-[120px] pb-12 px-4 min-h-[600px] flex flex-col items-center justify-center">
      
    {/* العنوان الرئيسي - كامل العرض بحواف مستديرة */}
<div className="w-full bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 py-4 -mt-8 mb-4 mx-4 md:mx-0">
  <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-l from-gray-950 via-gray-900 to-teal-400 bg-clip-text text-transparent px-4">
    السوق السوري الرقمي
  </h1>
</div>
     
     
     

    <p className="text-xl md:text-2xl text-[#1E3A5F] mt-4 text-center max-w-xl">
  وسيطك الموثوق في الإعلانات والصفقات
</p>

      {/* صندوق البحث - زجاجي */}
      <form onSubmit={handleSearch} className="w-full max-w-3xl mt-10">
        <div className="bg-white/30 backdrop-blur-md shadow-lg rounded-3xl p-4 flex flex-col md:flex-row gap-3 border border-white/50">
          
          {/* حقل المدينة */}
          <div className="flex items-center gap-2 bg-white/80 rounded-2xl px-4 py-3 flex-1 border border-[#E5E7EB]">
            <MapPin size={18} className="text-[#6B7280]" />
            <input
              type="text"
              placeholder="المدينة"
              className="bg-transparent outline-none text-[#111827] w-full text-sm"
            />
          </div>

          {/* حقل البحث */}
          <div className="flex items-center gap-2 bg-white/80 rounded-2xl px-4 py-3 flex-[2] border border-[#E5E7EB]">
            <Search size={18} className="text-[#6B7280]" />
            <input
              type="text"
              placeholder="ابحث عن أي شيء..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-[#111827] w-full text-sm"
            />
          </div>

          {/* زر البحث */}
          <button
            type="submit"
            className="bg-[#22C55E] text-white font-bold px-8 py-3 rounded-2xl hover:bg-[#16A34A] transition-colors"
          >
            بحث
          </button>
        </div>
      </form>

    {/* روابط سريعة */}
<div className="flex gap-4 mt-8 flex-wrap justify-center">
  {[
    { label: 'سيارات', icon: '🚗' },
    { label: 'عقارات', icon: '🏠' },
    { label: 'أجهزة', icon: '📱' },
    { label: 'خدمات', icon: '🔧' },
    { label: 'حجوزات', icon: '📅' },
    { label: 'نقل', icon: '🚚' },
  ].map((item) => (
    <button
      key={item.label}
      onClick={() => router.push(`/ar/search?q=${item.label}`)}
      className="flex flex-col items-center gap-2 bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 hover:bg-white/30 transition-all duration-300 min-w-[90px]"
    >
      <span className="text-2xl">{item.icon}</span>
      <span className="text-[#1E3A5F] text-sm font-bold">{item.label}</span>
    </button>
  ))}
</div>
    </section>
  );
}