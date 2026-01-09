import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const requiresAuth = pathname.startsWith('/api/profile') || pathname.startsWith('/api/comments');

  if (!requiresAuth) {
    return NextResponse.next();
  }

  // JWT 검증
  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT secret is not defined');
    jwt.verify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/:path*'],
};
