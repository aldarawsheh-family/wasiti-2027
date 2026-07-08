'use client';

import { NextIntlClientProvider } from 'next-intl';
import Topbar from '@/components/layout/Topbar';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider locale="ar">
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Topbar />
        <Sidebar />
        <main className="mr-0 md:mr-60 pt-14 min-h-screen">
          <div className="p-6 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </NextIntlClientProvider>
  );
}