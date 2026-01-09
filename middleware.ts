import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  console.log('[Middleware] Checking path:', pathname);

  // 인증 관련 API는 미들웨어 통과
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // 보호가 필요한 API만 JWT 체크
  const requiresAuth = pathname.startsWith('/api/profile') || pathname.startsWith('/api/comments');

  console.log('[Middleware] Path:', pathname, 'RequiresAuth:', requiresAuth);

  if (!requiresAuth) {
    console.log('[Middleware] Public API - allowing');
    return NextResponse.next();
  }

  // JWT 검증
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    console.log('[Middleware] No JWT token found');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret is not defined');
    jwt.verify(token, secret);
    console.log('[Middleware] JWT verified successfully');
    return NextResponse.next();
  } catch (error) {
    console.error('[Middleware] JWT verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
