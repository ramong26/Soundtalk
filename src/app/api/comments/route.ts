import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import connectToDB from '@/lib/mongo/mongo';
import { Comment } from '@/lib/mongo/models/Comment';

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
  console.log('='.repeat(80));
  console.log('[API /api/comments] GET - 댓글 조회 시작');
  console.log('[API /api/comments] GET - URL:', request.url);

  try {
    console.log('[API /api/comments] GET - MongoDB 연결 시도...');
    await connectToDB();
    console.log('[API /api/comments] GET - ✅ MongoDB 연결 성공');

    const url = request.nextUrl;
    const trackId = url.searchParams.get('trackId');
    console.log('[API /api/comments] GET - trackId:', trackId);

    if (!trackId) {
      console.warn('[API /api/comments] GET - ❌ trackId 파라미터 누락');
      return new Response('트랙 ID가 필요합니다', { status: 400 });
    }

    console.log('[API /api/comments] GET - Comment 모델에서 조회 중...');
    const comments = await Comment.find({ trackId })
      .sort({ createdAt: -1 })
      .populate('userId', 'displayName profileImageUrl');

    console.log('[API /api/comments] GET - ✅ 댓글 조회 성공:', comments.length, '개');

    if (comments.length > 0) {
      console.log('[API /api/comments] GET - 첫 번째 댓글 샘플:', {
        id: comments[0]._id,
        userId: comments[0].userId,
        textPreview: comments[0].text?.substring(0, 50),
      });
    }

    console.log('[API /api/comments] GET - 응답 반환');
    console.log('='.repeat(80));

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
    console.error('='.repeat(80));
    console.error('[API /api/comments] GET - ❌ 에러 발생!');
    console.error(
      '[API /api/comments] GET - 에러 타입:',
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error('[API /api/comments] GET - 에러 메시지:', error instanceof Error ? error.message : String(error));
    console.error('[API /api/comments] GET - 에러 스택:', error instanceof Error ? error.stack : 'No stack');
    console.error('='.repeat(80));

    return NextResponse.json(
      {
        error: '댓글 조회 실패',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
