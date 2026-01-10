import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { signupSchema } from '@/features/auth/schema/signupSchema';
import connectToDB from '@/lib/mongo/mongo';
import { UserModel } from '@/lib/mongo/models';

export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = await request.json();

    const parsedData = signupSchema.parse(body);
    const { email, username, password } = parsedData;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: '이미 가입된 이메일입니다.' }, { status: 409 });
    }

    const user = new UserModel({
      displayName: username,
      email,
      password,
      accessToken: '',
      refreshToken: '',
      profileImageUrl: '',
      localSignup: true,
    });

    try {
      await user.validate();
    } catch (err) {
      console.error('유저 검증 실패', err);
    }
    await user.save();

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('Configuration error: JWT secret is missing');
      return NextResponse.json({ error: '서버 설정 오류: JWT 시크릿 누락' }, { status: 500 });
    }

    const payload = { userId: user._id.toString() };
    const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });

    const response = NextResponse.json({ message: '회원가입 성공', token: jwtToken }, { status: 201 });

    response.cookies.set('jwt', jwtToken, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '유효하지 않은 입력값입니다.', details: error }, { status: 400 });
    }

    console.error('회원가입 처리 중 오류 발생:', error);
    return NextResponse.json({ error: '회원가입 처리 중 오류 발생' }, { status: 500 });
  }
}
