import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
});

const protectedRoutes = ['/ar/dashboard', '/ar/manage', '/ar/publish', '/ar/admin'];
const roleRoutes: Record<string, string[]> = {
  '/ar/dashboard/seller': ['SELLER'],
  '/ar/dashboard/company': ['COMPANY_ADMIN'],
  '/ar/admin': ['PLATFORM_OWNER', 'ADMIN', 'PLATFORM_ADMIN'],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value || '';
    if (!token) {
      return NextResponse.redirect(new URL('/ar/auth/login', request.url));
    }
    for (const [route, roles] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(route)) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (!roles.includes(payload.role)) {
            return NextResponse.redirect(new URL('/ar/dashboard', request.url));
          }
        } catch {
          return NextResponse.redirect(new URL('/ar/auth/login', request.url));
        }
      }
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};