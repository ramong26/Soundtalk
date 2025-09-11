import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { getBaseUrl, getGoogleRedirectUri } from '@/lib/utils/baseUrl';
import connectToDB from '@/lib/mongo/mongo';
import { UserModel } from '@/lib/mongo/models/UserModel';

export const runtime = 'nodejs'; // 몽고로 인해 nodejs 런타임 사용

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

interface GoogleUserProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  if (!code) {
    console.error('Authorization code not found');
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = getGoogleRedirectUri();

  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    console.error('BASE_URL is not defined');
    return NextResponse.json({ error: 'BASE_URL missing' }, { status: 500 });
  }

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Google environment variables');
    return NextResponse.json(
      { error: 'Server configuration error: missing environment variables' },
      { status: 500 }
    );
  }

  // 토큰 요청 바디
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  try {
    // 토큰 요청
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json();
      console.error('Token request failed:', errorData);
      return NextResponse.json({ error: errorData }, { status: tokenRes.status });
    }

    const tokenData: GoogleTokenResponse = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || '';
    // 사용자 정보 요청
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileRes.ok) {
      const errorData = await profileRes.json();
      console.error('User info request failed:', errorData);
      return NextResponse.json({ error: errorData }, { status: profileRes.status });
    }

    const profileData: GoogleUserProfile = await profileRes.json();

    // DB 연결
    await connectToDB();

    const user = await UserModel.findOneAndUpdate(
      { googleId: profileData.sub },
      {
        $set: {
          accessToken,
          refreshToken,
          lastLogin: new Date(),
        },
        $setOnInsert: {
          googleId: profileData.sub,
          displayName: profileData.name || 'No Name',
          email: profileData.email ? profileData.email : `${profileData.sub}@example.com`,
          profileImageUrl: profileData.picture || '',
        },
      },
      { upsert: true, new: true }
    );

    const payload = {
      userId: user._id.toString(),
    };

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'JWT_SECRET missing' }, { status: 500 });
    }

    const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

    // 리다이렉트 응답 생성 및 쿠키 설정
    const response = NextResponse.redirect(baseUrl);

    response.cookies.set('jwt', jwtToken, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in ?? 3600,
    });

    return response;
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.json(
      { error: 'Internal server error during authentication' },
      { status: 500 }
    );
  }
}
