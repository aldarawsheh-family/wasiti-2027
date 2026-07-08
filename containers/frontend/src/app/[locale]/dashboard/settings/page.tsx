'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Moon, Bell, Sun } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => router.push('/ar/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-[#128C4F] transition font-medium text-sm">
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </button>
        <h1 className="text-xl font-bold text-gray-900">الإعدادات</h1>
      </div>

      {/* Settings Card */}
      <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 space-y-4 shadow-md">
        {/* Theme */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C4F]/10 flex items-center justify-center">
              {theme === 'dark' ? <Moon size={20} className="text-[#128C4F]" /> : <Sun size={20} className="text-[#128C4F]" />}
            </div>
            <div>
              <span className="text-gray-900 font-semibold">المظهر</span>
              <p className="text-xs text-gray-400 mt-0.5">{theme === 'dark' ? 'داكن' : 'فاتح'}</p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {theme === 'dark' ? '🌙 داكن' : '☀️ فاتح'}
          </button>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#128C4F]/10 flex items-center justify-center">
              <Bell size={20} className="text-[#128C4F]" />
            </div>
            <div>
              <span className="text-gray-900 font-semibold">الإشعارات</span>
              <p className="text-xs text-gray-400 mt-0.5">{notifications ? 'مفعلة' : 'معطلة'}</p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-12 h-7 rounded-full transition-colors ${notifications ? 'bg-[#128C4F]' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${notifications ? 'right-0.5' : 'right-5'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}