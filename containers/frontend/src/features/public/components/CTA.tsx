'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, LayoutGrid, Heart, MessageCircle, User } from 'lucide-react';

const navItems = [
  { id: 'profile', label: 'حسابي', icon: User, href: '/ar/dashboard' },
  { id: 'chat', label: 'الرسائل', icon: MessageCircle, href: '/ar/chat' },
  { id: 'favorites', label: 'المفضلة', icon: Heart, href: '/ar/search' },
  { id: 'categories', label: 'التصنيفات', icon: LayoutGrid, href: '/ar/search' },
  { id: 'home', label: 'الرئيسية', icon: Home, href: '/ar' },
];

export default function CTA() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-6 left-4 right-4 flex justify-center z-50" style={{ maxWidth: '430px', margin: '0 auto' }}>
      <div className="w-full bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--border-light)] rounded-[30px] px-5 py-3 flex justify-between items-center shadow-[var(--shadow-nav)]">

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 min-w-[50px] relative group transition-colors ${
                isActive ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {isActive && (
                <div className="absolute -top-3 w-2 h-2 bg-[var(--color-primary)] rounded-full shadow-[0_0_10px_rgba(56,239,125,0.8)]"></div>
              )}
              <item.icon
                size={isActive ? 22 : 20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}