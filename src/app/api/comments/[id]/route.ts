import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import connectToDB from '@/lib/mongo/mongo';
import '@/lib/mongo/models/UserModel';
import { Comment } from '@/lib/mongo/models/Comment';

// 댓글 수정
export async function PUT(request: NextRequest) {
  await connectToDB();

  const token = request.cookies.get('jwt')?.value;

  if (!token) {
    return new Response('JWT not provided', { status: 401 });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    }
    const decoded = jwt.verify(token, jwtSecret!) as { userId: string };
    const userId = decoded.userId;
    const { text } = await request.json();
    const url = new URL(request.url);
    const pathname = url.pathname;
    const parts = pathname.split('/');
    const commentId = parts[parts.length - 1];

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return new Response('Invalid comment ID', { status: 400 });
    }

    if (!commentId) {
      return new Response('댓글 ID가 필요합니다', { status: 400 });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return new Response('댓글을 찾을 수 없습니다', { status: 404 });
    }

    if (comment.userId.toString() !== userId) {
      return new Response('댓글을 수정할 권한이 없습니다', { status: 403 });
    }

    const editedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        text,
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!editedComment) {
      return new Response('댓글 수정 실패', { status: 500 });
    }

    return NextResponse.json(editedComment, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('에러 발생 jwt 토큰이 없습니다:', error);
    return new Response('Invalid JWT token', { status: 401 });
  }
}

// 댓글 삭제
export async function DELETE(request: NextRequest) {
  await connectToDB();

  const token = request.cookies.get('jwt')?.value;
  if (!token) {
    return new Response('JWT not provided', { status: 401 });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined');
    }
    const decoded = jwt.verify(token, jwtSecret!) as { userId: string };
    const userId = decoded.userId;

    const url = new URL(request.url);
    const pathname = url.pathname;
    const parts = pathname.split('/');
    const commentId = parts[parts.length - 1];

    if (!commentId) {
      return new Response('댓글 ID가 필요합니다', { status: 400 });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return new Response('댓글을 찾을 수 없습니다', { status: 404 });
    }

    if (comment.userId.toString() !== userId) {
      return new Response('댓글을 삭제할 권한이 없습니다', { status: 403 });
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return new Response('댓글 삭제 실패', { status: 500 });
    }

    return NextResponse.json(
      { message: '댓글이 삭제되었습니다' },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('에러 발생 jwt 토큰이 없습니다:', error);
    return new Response('Invalid JWT token', { status: 401 });
  }
}
