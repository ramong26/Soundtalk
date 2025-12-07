import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import connectToDB from '@/lib/mongo/mongo';
import { Comment } from '@/lib/mongo/models/Comment';

interface JWTPayload {
  userId: string;
}

interface CommentCreateRequest {
  trackId: string;
  text: string;
}

// 댓글 작성
export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const token = request.cookies.get('jwt')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    const userId = decoded.userId;

    const body: CommentCreateRequest = await request.json();
    const { trackId, text } = body;

    if (!trackId || !text) {
      return NextResponse.json(
        { error: 'trackId and text are required' },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'Comment text cannot be empty' },
        { status: 400 }
      );
    }

    const newComment = await Comment.create({
      userId: new mongoose.Types.ObjectId(userId),
      trackId,
      text: trimmedText,
    });

    await newComment.populate('userId', 'displayName profileImageUrl');

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.error('Comment creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 댓글 목록 가져오기
export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const url = request.nextUrl;
    const trackId = url.searchParams.get('trackId');

    if (!trackId) {
      return NextResponse.json(
        { error: 'trackId parameter is required' },
        { status: 400 }
      );
    }

    const comments = await Comment.find({ trackId })
      .sort({ createdAt: -1 })
      .populate('userId', 'displayName profileImageUrl');

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
