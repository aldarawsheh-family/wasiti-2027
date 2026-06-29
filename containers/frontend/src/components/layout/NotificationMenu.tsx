// WASITI 2027 — NotificationMenu
// المسار: components/layout/NotificationMenu.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationMenuProps {
  className?: string;
}

export default function NotificationMenu({ className = '' }: NotificationMenuProps) {
  // بيانات تجريبية للإشعارات
  const notifications: NotificationItem[] = [
    { id: '1', title: 'طلب جديد', message: 'لديك طلب شراء جديد من أحمد', time: 'منذ 5 دقائق', read: false },
    { id: '2', title: 'صفقة مكتملة', message: 'تم إكمال صفقة السيارة بنجاح', time: 'منذ ساعة', read: false },
    { id: '3', title: 'تقييم جديد', message: 'قام محمد بتقييم خدمتك بـ 5 نجوم', time: 'منذ 3 ساعات', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // عناصر القائمة المنسدلة
  const dropdownItems = [
    ...notifications.slice(0, 3).map((item) => ({
      label: (
        <div className="flex flex-col gap-1 py-1">
          <div className={`text-sm font-medium ${item.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-main)]'}`}>
            {item.title}
          </div>
          <div className="text-xs text-[var(--text-secondary)]">{item.message}</div>
          <div className="text-xs text-[var(--text-secondary)] opacity-70">{item.time}</div>
        </div>
      ) as unknown as string,
      onClick: () => {
        console.log('فتح الإشعار:', item.id);
      },
    })),
    {
      label: 'عرض الكل',
      onClick: () => {
        // توجيه إلى صفحة الإشعارات
        window.location.href = '/notifications';
      },
    },
  ];

  return (
    <Dropdown
      trigger={
        <button
          className={`
            flex items-center justify-center
            w-10 h-10
            rounded-full
            bg-[var(--glass-bg)]
            backdrop-blur-[var(--glass-blur)]
            border border-[var(--border-color)]
            text-[var(--text-main)]
            transition-all duration-200
            hover:scale-105
            relative
            ${className}
          `}
          aria-label="الإشعارات"
        >
          <span className="text-lg">🔔</span>
          {unreadCount > 0 && (
            <Badge variant="error" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] min-w-[18px] text-center">
              {unreadCount}
            </Badge>
          )}
        </button>
      }
      items={dropdownItems}
      align="right"
    />
  );
}
