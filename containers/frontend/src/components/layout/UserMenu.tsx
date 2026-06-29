// WASITI 2027 — UserMenu
// المسار: components/layout/UserMenu.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Dropdown from '../ui/Dropdown';
import Avatar from '../ui/Avatar';

interface UserMenuProps {
  userName?: string;
  userImage?: string;
  className?: string;
}

export default function UserMenu({
  userName = 'مستخدم',
  userImage,
  className = '',
}: UserMenuProps) {
  const router = useRouter();

  const dropdownItems = [
    {
      label: 'الملف الشخصي',
      onClick: () => router.push('/profile'),
    },
    {
      label: 'الإعدادات',
      onClick: () => router.push('/settings'),
    },
    {
      label: 'خروج',
      onClick: () => {
        // هنا يتم وضع منطق تسجيل الخروج
        console.log('تسجيل خروج');
      },
    },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="hidden sm:block text-[var(--text-main)] font-medium text-sm">
        {userName}
      </div>
      
      <Dropdown
        trigger={
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar src={userImage} name={userName} size="sm" />
          </div>
        }
        items={dropdownItems}
        align="right"
      />
    </div>
  );
}