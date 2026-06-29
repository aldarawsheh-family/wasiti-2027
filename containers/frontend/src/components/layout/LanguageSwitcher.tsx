// WASITI 2027 — LanguageSwitcher
// المسار: components/layout/LanguageSwitcher.tsx

'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Dropdown from '../ui/Dropdown';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  // استخراج اللغة الحالية من المسار
  const currentLocale = pathname?.split('/')[1] || 'ar';

  const languages = [
    { label: 'العربية', value: 'ar' },
    { label: 'English', value: 'en' },
  ];

  const handleLanguageChange = (locale: string) => {
    // الحصول على المسار الحالي بدون اللغة
    const pathWithoutLocale = pathname?.replace(/^\/[a-z]{2}/, '') || '';
    // إعادة التوجيه للغة الجديدة
    router.push(`/${locale}${pathWithoutLocale}`);
  };

  const dropdownItems = languages.map((lang) => ({
    label: lang.label,
    onClick: () => handleLanguageChange(lang.value),
  }));

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
            ${className}
          `}
          aria-label="تبديل اللغة"
        >
          <span className="text-lg">🌐</span>
        </button>
      }
      items={dropdownItems}
      align="right"
    />
  );
}