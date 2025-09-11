import { NextResponse, NextRequest } from 'next/server';
import { getYoutubeChannelInfo } from '@/features/tracks/hooks/getYoutubeMongo';

export async function GET(req: NextRequest, { params }: { params: { handle: string } }) {
  const data = await getYoutubeChannelInfo(params.handle);
  return NextResponse.json(data);
}
