'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

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
    <div className="px-0 space-y-4">
      {/* العنوان */}
      <section className="text-center mb-4 mt-2">
        <h1 className="text-2xl font-extrabold mb-1 leading-tight tracking-wide bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-blue)] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,255,136,0.2)]">
          السوق السوري الرقمي
        </h1>
        <p className="text-[var(--text-secondary)] text-xs">
          اكتشف أفضل الصفقات بالقرب منك
        </p>
      </section>

      {/* شريط البحث */}
      <section className="mb-6">
        <form onSubmit={handleSearch}>
          <div className="relative w-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-[1.5px] shadow-[var(--shadow-neon)] transition-shadow duration-300 hover:shadow-[var(--shadow-neon-strong)]">
            <div className="relative bg-[var(--bg-input)] rounded-full w-full h-full flex items-center">
              <input
                type="text"
                placeholder="ابحث عن أي شيء..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 bg-transparent rounded-full pl-4 pr-12 text-gray-300 outline-none placeholder-gray-500 text-[15px]"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}