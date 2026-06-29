'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Building2, Smartphone, Wrench, Armchair, ShoppingBag } from 'lucide-react';

const categories = [
  { label: 'سيارات', icon: Car, color: '#00ff88' },
  { label: 'عقارات', icon: Building2, color: '#a855f7' },
  { label: 'موبايلات', icon: Smartphone, color: '#3b82f6' },
  { label: 'وظائف', icon: ShoppingBag, color: '#facc15' },
  { label: 'أثاث', icon: Armchair, color: '#ef4444' },
  { label: 'خدمات', icon: Wrench, color: '#22d3ee' },
];

export default function WhyUs() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryClick = (label: string) => {
    setSelectedCategory(label);
    router.push(`/ar/search?category=${encodeURIComponent(label)}`);
  };

  return (
    <section className="grid grid-cols-3 gap-4 mb-8 text-center">
      {categories.map((item, index) => (
        <button
          key={index}
          onClick={() => handleCategoryClick(item.label)}
          className="w-[62px] h-[62px] mx-auto rounded-full bg-[var(--bg-input)] border border-[var(--border-light)] flex flex-col items-center justify-center gap-[2px] cursor-pointer group transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-[0_0_20px_rgba(0,255,136,0.15)]"
        >
          <div style={{ color: item.color }} className="group-hover:scale-110 transition-transform">
            <item.icon size={22} />
          </div>
          <span className="text-[10px] text-[var(--text-secondary)] group-hover:text-white transition-colors font-medium leading-none">
            {item.label}
          </span>
        </button>
      ))}
    </section>
  );
}