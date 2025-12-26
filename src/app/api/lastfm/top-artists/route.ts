import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.LAST_FM_API_KEY;
  const { searchParams } = request.nextUrl;
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '10';

  if (!apiKey) {
    return NextResponse.json({ error: 'Last.fm API key is not configured.' }, { status: 500 });
  }

  const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${apiKey}&format=json&page=${page}&limit=${limit}`;

  try {
    const topArtistsRes = await fetch(url, { cache: 'no-store' });

    if (!topArtistsRes.ok) {
      const errBody = await topArtistsRes.text().catch(() => '');
      console.error(
        'Last.fm Top Artists Fetch failed:',
        topArtistsRes.status,
        topArtistsRes.statusText,
        errBody
      );

      return new Response(
        JSON.stringify({
          error: `Last.fm Top Artists Fetch failed: ${topArtistsRes.status} ${topArtistsRes.statusText}`,
        }),
        { status: topArtistsRes.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await topArtistsRes.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
