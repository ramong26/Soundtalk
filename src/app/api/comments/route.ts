import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import connectToDB from '@/lib/mongo/mongo';
import { Comment, UserModel } from '@/lib/mongo/models';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ensureUserModel = UserModel;

// 댓글 작성
export async function POST(request: NextRequest) {
  await connectToDB();

  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return new Response('로그인이 필요합니다', { status: 401 });
  }
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret!) as {
      userId: string;
    };
    const userId = decoded.userId;

    const { trackId, text } = await request.json();
    if (!trackId || !text) {
      return new Response('트랙 ID와 댓글 내용이 필요합니다', { status: 400 });
    }

    const newComment = await Comment.create({
      userId: new mongoose.Types.ObjectId(userId),
      trackId,
      text,
    });

    await newComment.populate('userId', 'displayName profileImageUrl');

    return NextResponse.json(newComment, {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('에러 발생 jwt 토큰이 없습니다:', error);
    return new Response('Invalid JWT token', { status: 401 });
  }
}

// 댓글 목록 가져오기
export async function GET(request: NextRequest) {
  await connectToDB();

  const url = request.nextUrl;
  const trackId = url.searchParams.get('trackId');

  if (!trackId) {
    console.error('트랙 ID가 제공되지 않았습니다');
    return new Response('트랙 ID가 필요합니다', { status: 400 });
  }

  try {
    const comments = await Comment.find({ trackId })
      .sort({ createdAt: -1 })
      .populate('userId', 'displayName profileImageUrl');

    console.log('Comments found:', comments.length);

    return NextResponse.json(
      { comments },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('GET comments 에러:', error);
    return NextResponse.json({ error: '댓글 조회 실패' }, { status: 500 });
  }
}
