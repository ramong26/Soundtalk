export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getTrackData } from '@/features/tracks/lib/spotify/actions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: PageProps) {
  const { id } = await context.params;

  if (!id) {
    console.error('GET /api/tracks/[id] missing id parameter');
    return NextResponse.json({ error: 'Missing track ID' }, { status: 400 });
  }

  try {
    const data = await getTrackData(id);

    return NextResponse.json(data);
  } catch (err) {
    console.error('GET /api/tracks/[id] error:', err);

    const errorMessage = err instanceof Error ? err.message : 'Internal Server Error';
    const statusCode = errorMessage.includes('Spotify') ? 502 : 500;

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
