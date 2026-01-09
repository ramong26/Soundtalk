import { NextResponse, NextRequest } from 'next/server';
import { getClientCredentialsToken } from '@/lib/spotify/spotifyTokenManager';
import { SpotifyTopArtistsResponse } from '@/shared/types/spotifyTrack';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: PageProps) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    const token = await getClientCredentialsToken();

    // TODO: 스포티파이 로그인자 / 로컬 로그인자 / 비로그인자 구분 필요
    const favoriteArtistRes = await fetch(`https://api.spotify.com/v1/me/top/artists`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!favoriteArtistRes.ok) {
      const errBody = await favoriteArtistRes.text().catch(() => '');
      console.error(
        'Spotify Favorite Artists Fetch failed:',
        favoriteArtistRes.status,
        favoriteArtistRes.statusText,
        errBody
      );

      return NextResponse.json(
        {
          error: `Spotify Favorite Artists Fetch failed: ${favoriteArtistRes.status} ${favoriteArtistRes.statusText}`,
        },
        { status: favoriteArtistRes.status }
      );
    }

    const favoriteArtistBody = await favoriteArtistRes.text().catch(() => '');
    let favoriteArtists: SpotifyTopArtistsResponse | null = null;
    if (favoriteArtistBody) {
      try {
        favoriteArtists = JSON.parse(favoriteArtistBody);
      } catch (e) {
        console.error('Spotify Favorite Artists JSON parse error. Body was:', favoriteArtistBody, e);
        return NextResponse.json({ error: 'Failed to parse Spotify Favorite Artists JSON response.' }, { status: 502 });
      }
    } else {
      return NextResponse.json({ error: 'Empty Spotify Favorite Artists response body.' }, { status: 502 });
    }

    if (!favoriteArtists) {
      return NextResponse.json({ error: 'Failed to parse Spotify Favorite Artists JSON response.' }, { status: 502 });
    }

    return NextResponse.json(favoriteArtists);
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
