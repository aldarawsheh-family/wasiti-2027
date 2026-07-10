import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'ar',
});

const protectedRoutes = ['/ar/dashboard', '/ar/manage', '/ar/publish', '/ar/admin', '/ar/listing/create'];

const roleRoutes: Record<string, string[]> = {
  '/ar/admin': ['PLATFORM_OWNER', 'ADMIN', 'SUPPORT', 'MODERATOR'],
  '/ar/admin/users': ['PLATFORM_OWNER', 'ADMIN'],
  '/ar/admin/wallet': ['PLATFORM_OWNER', 'ADMIN'],
  '/ar/admin/system': ['PLATFORM_OWNER'],
  '/ar/admin/revenue': ['PLATFORM_OWNER', 'ADMIN'],
  '/ar/admin/tenants': ['PLATFORM_OWNER'],
  '/ar/admin/subscriptions': ['PLATFORM_OWNER', 'ADMIN'],
  '/ar/admin/audit-log': ['PLATFORM_OWNER', 'ADMIN'],
  '/ar/dashboard/seller': ['SELLER', 'COMPANY_ADMIN', 'ADMIN', 'PLATFORM_OWNER'],
  '/ar/dashboard/company': ['COMPANY_ADMIN', 'ADMIN', 'PLATFORM_OWNER'],
  '/ar/listing/create': ['SELLER', 'COMPANY_ADMIN', 'ADMIN', 'PLATFORM_OWNER'],
  '/ar/dashboard/wallet': ['USER', 'SELLER', 'COMPANY_ADMIN', 'ADMIN', 'PLATFORM_OWNER'],
};

const adminRoles = ['PLATFORM_OWNER', 'ADMIN'];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected) {
    console.log('RAW COOKIE HEADER:', request.headers.get('cookie'));
    
    const urlToken = request.nextUrl.searchParams.get('token') || '';
    const allCookies = request.cookies.getAll();
    console.log('ALL COOKIES:', allCookies.map(c => c.name));
    const token = request.cookies.get('auth_token')?.value || urlToken;
    
    console.log('MIDDLEWARE:', { pathname, token: token?.substring(0, 20) || 'none' });
    
    if (!token) {
      return NextResponse.redirect(new URL('/ar/auth/login', request.url));
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('MIDDLEWARE ROLE:', payload.role);

      if (pathname === '/ar/dashboard' && adminRoles.includes(payload.role)) {
        return NextResponse.redirect(new URL('/ar/admin', request.url));
      }

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
    } catch (err) {
      console.log('MIDDLEWARE ERROR:', err);
      return NextResponse.redirect(new URL('/ar/auth/login', request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};