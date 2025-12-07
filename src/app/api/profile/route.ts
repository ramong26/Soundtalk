import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import connectToDB from '@/lib/mongo/mongo';
import { UserModel } from '@/lib/mongo/models/UserModel';

interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

interface UserResponse {
  displayName: string;
  profileImageUrl: string | null;
  id: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('jwt')?.value;

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

    await connectToDB();

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    const response: UserResponse = {
      displayName: user.displayName,
      profileImageUrl: user.profileImageUrl || null,
      id: user._id.toString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' }, 
        { status: 401 }
      );
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { error: 'Token expired' }, 
        { status: 401 }
      );
    }

    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
