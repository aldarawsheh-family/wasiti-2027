// WASITI 2027 — Sidebar
// المسار: components/layout/Sidebar.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

const sidebarItems: SidebarItem[] = [
  { label: 'لوحة التحكم', href: '/dashboard', icon: '📊' },
  { label: 'الإعلانات', href: '/listings', icon: '📦' },
  { label: 'المحادثات', href: '/chat', icon: '💬' },
  { label: 'الصفقات', href: '/deals', icon: '🤝' },
  { label: 'الإعدادات', href: '/settings', icon: '⚙️' },
];

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        fixed left-0 top-16
        h-[calc(100vh-4rem)]
        w-64
        bg-[var(--glass-bg)]
        backdrop-blur-[var(--glass-blur)]
        border-r border-[var(--border-color)]
        overflow-y-auto
        hidden md:block
        z-40
        ${className}
      `}
    >
      <div className="flex flex-col gap-1 p-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3
                px-4 py-3
                rounded-[var(--radius-md)]
                transition-all duration-200
                ${isActive 
                  ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-medium' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]'
                }
              `}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}