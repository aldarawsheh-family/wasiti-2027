// WASITI 2027 — Footer
// المسار: components/layout/Footer.tsx

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'استكشف', href: '/explore' },
    { label: 'نشر إعلان', href: '/publish' },
    { label: 'اتصل بنا', href: '/contact' },
  ];

  return (
    <footer className="w-full bg-[var(--bg-card)] border-t border-[var(--border-color)]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* العمود 1: عن وسيطي */}
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-[var(--color-primary)]">WASI</span>
              <span className="text-[var(--color-secondary)]">TI</span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xs">
              منصة ذكية للبيع والشراء في سوريا. ثقة أعلى، تجربة أفضل، مستقبل أكثر إشراقاً.
            </p>
          </div>

          {/* العمود 2: روابط سريعة */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[var(--text-main)] font-bold text-lg">روابط سريعة</h3>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود 3: تواصل معنا */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[var(--text-main)] font-bold text-lg">تواصل معنا</h3>
            <div className="flex flex-col gap-2 text-[var(--text-secondary)] text-sm">
              <p>📧 info@wasiti.ly</p>
              <p>📞 +963 123 456 789</p>
              <p>📍 دمشق، سوريا</p>
            </div>
          </div>
        </div>

        {/* النص السفلي */}
        <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center text-[var(--text-secondary)] text-sm">
          © {currentYear} WASITI. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}