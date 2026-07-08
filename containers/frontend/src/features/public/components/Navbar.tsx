'use client';

import Link from 'next/link';
import { Plus, Bell, Search } from 'lucide-react';

const menuItems = [
  { label: 'الرئيسية', href: '/ar' },
  { label: 'البحث', href: '/ar/search' },
  { label: 'الإعلانات', href: '/ar/listings' },
  { label: 'الخدمات', href: '/ar/services' },
  { label: 'لماذا وسيط؟', href: '/ar/why-us' },
  { label: 'اتصل بنا', href: '/ar/contact' },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 py-3 bg-white/20 backdrop-blur-xl border-b border-white/30 h-[72px]">
      
      {/* القسم اليمين: الشعار + القائمة */}
      <div className="flex items-center gap-8">
        {/* الشعار */}
        <Link href="/ar" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#22C55E] shadow-lg" />
          <span className="font-bold text-lg tracking-wider text-[#111827]">
            WASITI
          </span>
        </Link>

        {/* القائمة - Desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[#6B7280] hover:text-[#22C55E] text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* القسم اليسار: زر النشر + الأيقونات */}
      <div className="flex items-center gap-3">
        {/* زر نشر إعلانك */}
        <Link
          href="/ar/publish"
          className="bg-[#22C55E] text-white text-sm font-bold px-5 py-2 rounded-[18px] flex items-center gap-2 hover:bg-[#16A34A] transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">نشر إعلانك</span>
        </Link>

        {/* أيقونة الإشعارات */}
        <button className="p-2 text-[#6B7280] hover:text-[#111827] transition-colors">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}