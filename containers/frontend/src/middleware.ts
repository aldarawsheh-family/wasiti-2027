import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
});

const protectedRoutes = ['/ar/dashboard', '/ar/manage', '/ar/publish', '/ar/admin'];

const roleRoutes: Record<string, string[]> = {
  '/ar/dashboard/seller': ['SELLER', 'COMPANY_ADMIN', 'ADMIN', 'PLATFORM_OWNER'],
  '/ar/dashboard/company': ['COMPANY_ADMIN', 'ADMIN', 'PLATFORM_OWNER'],
  '/ar/admin': ['PLATFORM_OWNER', 'ADMIN', 'SUPPORT', 'MODERATOR'],
};

const adminRoles = ['PLATFORM_OWNER', 'ADMIN', 'SUPPORT', 'MODERATOR'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected) {
    const token = request.cookies.get('auth_token')?.value || '';
    if (!token) {
      return NextResponse.redirect(new URL('/ar/auth/login', request.url));
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));

      // PLATFORM_OWNER + ADMIN يتوجهون لـ /admin بعد تسجيل الدخول
      if (pathname === '/ar/dashboard' && adminRoles.includes(payload.role)) {
        return NextResponse.redirect(new URL('/ar/admin', request.url));
      }

      // USER عادي يحاول دخول /admin
      if (pathname.startsWith('/ar/admin') && !adminRoles.includes(payload.role)) {
        return NextResponse.redirect(new URL('/ar/dashboard', request.url));
      }

      for (const [route, roles] of Object.entries(roleRoutes)) {
        if (pathname.startsWith(route)) {
          if (!roles.includes(payload.role)) {
            return NextResponse.redirect(new URL('/ar/dashboard', request.url));
          }
        }
      }
    } catch {
      return NextResponse.redirect(new URL('/ar/auth/login', request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};