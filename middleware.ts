import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const PUBLIC_API_PATHS = [
  '/api/auth/',
  '/api/tracks/',
  '/api/spotify/',
  '/api/lastfm/',
  '/api/gemini-api/',
  '/api/google-api/',
  '/api/wiki/',
  '/api/youtube-search',
  '/api/mongo/',
];

const PROTECTED_API_PATHS = ['/api/profile', '/api/comments'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('[Middleware] Checking:', pathname);

  // 공개 API 체크 - 먼저!
  const isPublic = PUBLIC_API_PATHS.some((path) => pathname.startsWith(path));
  if (isPublic) {
    console.log('[Middleware] Public API - ALLOW');
    return NextResponse.next();
  }

  // 보호된 API 체크
  const isProtected = PROTECTED_API_PATHS.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    console.log('[Middleware] Not protected - ALLOW');
    return NextResponse.next();
  }

  // JWT 검증
  console.log('[Middleware] Protected API - checking JWT');
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    console.log('[Middleware] No JWT - DENY');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret is not defined');
    jwt.verify(token, secret);
    console.log('[Middleware] JWT valid - ALLOW');
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] JWT invalid - DENY:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
