import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDB from '@/lib/mongo/mongo';
import { UserModel } from '@/lib/mongo/models/UserModel';

export async function POST(request: NextRequest) {
  await connectToDB();

  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: '리프레시 토큰이 없습니다.' }, { status: 401 });
  }

  let payload;
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  try {
    if (!jwtRefreshSecret) {
      console.error('JWT_REFRESH_SECRET is not defined');
      return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
    }
    payload = jwt.verify(refreshToken, jwtRefreshSecret) as { userId: string };
  } catch (error) {
    console.error('리프레시 토큰 처리 중 오류 발생:', error);
    return NextResponse.json({ error: '유효하지 않은 리프레시 토큰입니다.' }, { status: 401 });
  }

  const user = await UserModel.findById(payload.userId);
  if (!user || user.refreshToken !== refreshToken) {
    return NextResponse.json(
      { error: '사용자를 찾을 수 없거나 토큰이 일치하지 않습니다.' },
      { status: 401 }
    );
  }

  const accessToken = jwt.sign({ userId: user._id.toString() }, jwtRefreshSecret, {
    expiresIn: '1d',
  });

  const response = NextResponse.json({ message: '토큰 갱신 성공', accessToken }, { status: 200 });
  response.cookies.set('jwt', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400,
  });

  return response;
}
