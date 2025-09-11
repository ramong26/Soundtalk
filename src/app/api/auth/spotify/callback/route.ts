import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

import { getBaseUrl, getSpotifyRedirectUri } from '@/lib/utils/baseUrl';
import connectToDB from '@/lib/mongo/mongo';
import { UserModel } from '@/lib/mongo/models/UserModel';

export const runtime = 'nodejs'; // 몽고로 인해 nodejs 런타임 사용

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  if (!code) {
    console.error('Authorization code not found');
    return NextResponse.json({ error: 'Authorization code not found' }, { status: 400 });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = getSpotifyRedirectUri();

  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    console.error('BASE_URL is not defined');
    return NextResponse.json({ error: 'BASE_URL missing' }, { status: 500 });
  }

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing Spotify environment variables');
    return NextResponse.json(
      { error: 'Server configuration error: missing environment variables' },
      { status: 500 }
    );
  }

  // 토큰 요청 바디
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    // 토큰 요청
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: body.toString(),
    });

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json();
      console.error('Token request failed:', errorData);
      return NextResponse.json({ error: errorData }, { status: tokenRes.status });
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || '';
    // 사용자 프로필 요청
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!profileRes.ok) {
      const errorProfile = await profileRes.json();
      console.error('Profile request failed:', errorProfile);
      return NextResponse.json({ error: errorProfile }, { status: profileRes.status });
    }

    const profileData = await profileRes.json();

    // DB 연결
    await connectToDB();

    // 사용자 정보 저장 (upsert)
    const user = await UserModel.findOneAndUpdate(
      { spotifyId: profileData.id },
      {
        $set: {
          accessToken,
          refreshToken,
          lastLogin: new Date(),
        },
        $setOnInsert: {
          spotifyId: profileData.id,
          displayName: profileData.display_name || 'No Name',
          email: profileData.email
            ? `${profileData.email.split('@')[0]}@spotify.com`
            : `${profileData.id}@spotify.com`,
          profileImageUrl: profileData.images?.[0]?.url || '',
        },
      },
      { upsert: true, new: true }
    );

    // const user = await UserModel.findOneAndUpdate(
    //   { spotifyId: profileData.id },
    //   {
    //     spotifyId: profileData.id,
    //     displayName: profileData.display_name || 'No Name',
    //     email: profileData.email || `${profileData.id}@example.com`,
    //     profileImageUrl: profileData.images?.[0]?.url || '',
    //     lastLogin: new Date(),
    //     accessToken,
    //     refreshToken,
    //   },
    //   { upsert: true, new: true }
    // );

    const payload = {
      userId: user._id.toString(),
    };
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ error: 'JWT secret missing' }, { status: 500 });
    }

    const jwtToken = jwt.sign(payload, jwtSecret, {
      expiresIn: '1d',
    });
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
