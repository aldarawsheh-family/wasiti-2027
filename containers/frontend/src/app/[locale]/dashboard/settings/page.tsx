'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';
import { ArrowRight, Moon, Bell } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pt-2">
        <Button variant="glass" size="sm" onClick={() => router.push('/ar/dashboard')}>
          <ArrowRight size={18} className="rotate-180" /> رجوع
        </Button>
        <span className="font-bold text-white">الإعدادات</span>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
              <Moon size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <span className="text-white font-medium">الثيم</span>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{theme === 'dark' ? 'داكن' : 'فاتح'}</p>
            </div>
          </div>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="bg-[var(--bg-input)] hover:bg-white/10 border border-[var(--border-color)] text-white px-4 py-2 rounded-xl text-sm transition-colors">
            {theme === 'dark' ? 'داكن 🌙' : 'فاتح ☀️'}
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center">
              <Bell size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <span className="text-white font-medium">الإشعارات</span>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{notifications ? 'مفعلة' : 'معطلة'}</p>
            </div>
          </div>
          <Switch checked={notifications} onChange={setNotifications} />
        </div>
      </Card>
    </div>
  );
}