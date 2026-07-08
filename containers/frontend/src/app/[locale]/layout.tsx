import '@/styles/globals.css';
import AuthProvider from '@/components/auth/AuthProvider';

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function RootLayout({ children, params }: RootLayoutProps) {
  const locale = params.locale || 'ar';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}