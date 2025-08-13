import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { jwtVerify } from 'jose';

// TODO: The JWT_SECRET must be loaded from environment variables.
const JWT_SECRET_STRING = "some-super-secret-and-long-string-for-jwt-42";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

const I18nMiddleware = createI18nMiddleware({
  locales: ['en', 'id'],
  defaultLocale: 'id',
  urlMappingStrategy: 'rewrite',
});

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedApiRoutes = [
    '/api/news',
    '/api/events',
    '/api/businesses',
    '/api/gallery',
    '/api/reviews',
  ];

  const isProtectedRoute = protectedApiRoutes.some(path => pathname.startsWith(path));

  if (isProtectedRoute && req.method !== 'GET') {
    const authHeader = req.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new NextResponse(JSON.stringify({ message: 'Authorization header missing' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = authHeader.split(' ')[1];

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);

      // Clone the request headers and set a new header
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('X-User-Id', payload.userId as string);

      // Create a new request with the new headers
      const newRequest = new NextRequest(req.nextUrl, {
        ...req,
        headers: requestHeaders,
      });

      // Pass the new request to the i18n middleware
      return I18nMiddleware(newRequest);

    } catch (error) {
      return new NextResponse(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // For all other requests, just run the i18n middleware
  return I18nMiddleware(req);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
};
