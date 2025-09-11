import { NextResponse, NextRequest } from 'next/server';
import { getYoutubeChannelInfo } from '@/features/tracks/hooks/getYoutubeMongo';

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function GET(request: NextRequest, { params }: PageProps) {
  const { handle } = await params;
  const data = await getYoutubeChannelInfo(handle);
  return NextResponse.json(data);
}
