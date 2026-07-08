'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/features/public/components/Navbar';
import Hero from '@/features/public/components/Hero';
import Stats from '@/features/public/components/Stats';
import FeaturedListings from '@/features/listings/components/FeaturedListings';
import { Home, LayoutDashboard, PlusSquare, MessageCircle, User } from 'lucide-react';

const bottomNav = [
  { id: 'home', label: 'الرئيسية', icon: Home, href: '/ar/public/home' },
  { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard, href: '/ar/dashboard' },
  { id: 'add', label: 'نشر', icon: PlusSquare, href: '/ar/publish' },
  { id: 'chat', label: 'رسائل', icon: MessageCircle, href: '/ar/chat' },
  { id: 'profile', label: 'حسابي', icon: User, href: '/ar/dashboard/profile' },
];

export default function PublicHomePage() {
  const [activeTab, setActiveTab] = useState('الرئيسية');

  return (
    <main dir="rtl" className="min-h-screen text-[#111827] font-sans relative pb-28">
      
      {/* خلفية الصفحة الرئيسية */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: 'url(/images/home-bg.jpg)' }}
      />
      
      {/* طبقة تظليل */}
      <div className="fixed inset-0 bg-white/30 z-[1]" />

      {/* المحتوى */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <div className="py-6" />
        <Stats />
        <div className="py-6" />
        <FeaturedListings />
      </div>

      {/* شريط سفلي زجاجي - نفس ستايل Dashboard */}
      <div className="fixed bottom-6 left-4 right-4 flex justify-center z-30" style={{ maxWidth: '430px', margin: '0 auto' }}>
        <div className="w-full bg-white/60 backdrop-blur-xl border border-white/40 rounded-[30px] px-5 py-3 flex justify-between items-center shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          {bottomNav.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.label)}
                className={`flex flex-col items-center gap-1 min-w-[50px] relative transition-all ${
                  isActive ? 'text-[#22C55E]' : 'text-gray-400'
                }`}
              >
                {isActive && (
                  <div className="absolute -top-3 w-2 h-2 bg-[#22C55E] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                )}
                <item.icon size={isActive ? 22 : 20} />
                <span className="text-[10px] font-medium text-black/70">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

    </main>
  );
}