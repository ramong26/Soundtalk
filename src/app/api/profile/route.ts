import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

import connectToDB from '@/lib/mongo/mongo';
import { UserModel } from '@/lib/mongo/models/UserModel';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('jwt')?.value;

  if (!token) {
    return NextResponse.json({ error: 'JWT not found' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    await connectToDB();

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      displayName: user.displayName,
      profileImageUrl: user.profileImageUrl || null,
      id: user._id.toString(),
      userType: user.spotifyId ? 'spotify' : user.googleId ? 'google' : 'local',
    });
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}
