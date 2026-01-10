import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (request.method === 'OPTIONS') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/auth/') || (pathname.startsWith('/api/comments') && request.method === 'GET')) {
    return NextResponse.next();
  }

  const requiresAuth = pathname.startsWith('/api/profile') || pathname.startsWith('/api/comments');

  if (!requiresAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
