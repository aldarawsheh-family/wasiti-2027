// WASITI 2027 — Root Layout (النسخة النهائية باستخدام @/)
// المسار: app/[locale]/layout.tsx

import '@/styles/globals.css'; // ✅ استخدام @ للإشارة إلى مجلد src

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const locale = params.locale || 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}