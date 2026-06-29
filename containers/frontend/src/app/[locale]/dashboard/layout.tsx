'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { NextIntlClientProvider } from 'next-intl';
import { Home, Search, PlusSquare, MessageCircle, User, Menu, Bell, X, LayoutDashboard, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const locale = params.locale as string || 'ar';
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'مستخدم';

  useEffect(() => { setIsSidebarOpen(false); }, [pathname]);

  const sidebarItems = [
    { label: 'لوحة التحكم', icon: LayoutDashboard, href: '/ar/dashboard' },
    { label: 'الملف الشخصي', icon: User, href: '/ar/dashboard/profile' },
    { label: 'الإعدادات', icon: Settings, href: '/ar/dashboard/settings' },
  ];

  return (
    <NextIntlClientProvider locale={locale}>
      <div className="min-h-screen bg-[var(--bg-dark)] text-white font-sans relative">

        {/* Sidebar */}
        <div className={`fixed inset-y-0 right-0 w-[85%] max-w-[320px] bg-[var(--bg-dark)]/95 backdrop-blur-2xl border-l border-[var(--border-color)] z-50 transform transition-transform duration-300 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center shadow-[var(--shadow-neon)]">
                  <span className="text-black font-bold text-sm">و</span>
                </div>
                <span className="font-bold text-sm text-white">WASITI</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={24} className="text-white/80" /></button>
            </div>

            <div className="flex-1 space-y-2">
              {sidebarItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={index} href={item.href} onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border text-right ${isActive ? 'bg-[var(--color-primary)]/10 border-[var(--color-primary)]/30' : 'bg-white/5 border-[var(--border-color)] hover:bg-white/10'}`}>
                    <span className={isActive ? 'text-[var(--color-primary)]' : 'text-[var(--text-secondary)]'}><item.icon size={20} /></span>
                    <span className="font-medium text-white">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-6 border-t border-[var(--border-color)]">
              <button onClick={() => { useAuthStore.getState().logout(); router.push('/ar'); }}
                className="w-full text-center text-sm text-[var(--text-secondary)] hover:text-red-400 transition-colors">تسجيل خروج</button>
            </div>
          </div>
        </div>

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

        <div className="relative z-10 px-4 pb-28">
          <div className="sticky top-4 z-30 pt-2 pb-4">
            <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl px-4 py-3 flex justify-between items-center shadow-lg">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-white/10 rounded-lg"><Menu size={24} className="text-white/80" /></button>
              <div className="flex items-center gap-2">
                <button className="relative p-2 hover:bg-white/10 rounded-full"><Bell size={22} className="text-white/80" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                </button>
                <Link href="/ar/dashboard" className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#11998e] flex items-center justify-center border border-[var(--border-color)]">
                  <span className="text-black font-bold text-xs">{displayName.charAt(0).toUpperCase()}</span>
                </Link>
              </div>
            </div>
          </div>
          {children}
        </div>

        {/* شريط سفلي */}
        <div className="fixed bottom-6 left-4 right-4 flex justify-center z-30" style={{ maxWidth: '430px', margin: '0 auto' }}>
          <div className="w-full bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border border-[var(--border-light)] rounded-[30px] px-5 py-3 flex justify-between items-center shadow-[var(--shadow-nav)]">
            {[
              { id: 'home', label: 'الرئيسية', icon: Home, href: '/ar' },
              { id: 'search', label: 'بحث', icon: Search, href: '/ar/search' },
              { id: 'add', label: 'نشر', icon: PlusSquare, href: '/ar/publish' },
              { id: 'chat', label: 'رسائل', icon: MessageCircle, href: '/ar/chat' },
              { id: 'profile', label: 'حسابي', icon: User, href: '/ar/dashboard' },
            ].map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.id} href={item.href} className={`flex flex-col items-center gap-1 min-w-[50px] relative ${isActive ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-white'}`}>
                  {isActive && <div className="absolute -top-3 w-2 h-2 bg-[var(--color-primary)] rounded-full shadow-[0_0_10px_rgba(56,239,125,0.8)]" />}
                  <item.icon size={isActive ? 22 : 20} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </NextIntlClientProvider>
  );
}