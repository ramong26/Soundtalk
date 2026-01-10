import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongo/mongo';
import { getUserFromJwt } from '@/lib/auth/getUserFromJwt';
import { UserModel } from '@/lib/mongo/models/UserModel';

export async function GET() {
  await connectToDB();

  const user = await getUserFromJwt();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbUser = await UserModel.findById(user.userId);
  if (!dbUser || !dbUser.accessToken) {
    return NextResponse.json({ error: 'Access token not found' }, { status: 404 });
  }

  return NextResponse.json({ accessToken: dbUser.accessToken });
}
