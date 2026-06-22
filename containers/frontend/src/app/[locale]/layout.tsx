// ══════════════════════════════════════════════════
// WASITI 2027 — Frontend — Root Layout
// ══════════════════════════════════════════════════

import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'وسيطي 2027 — Wasity',
  description: 'السوق الذكي الجديد',
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen" data-theme="dark">
        {children}
      </body>
    </html>
  );
}