import { NextResponse, NextRequest } from 'next/server';
import { getSpotifyAccessToken } from '@/lib/spotify/spotifyTokenManager';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {
    const token = await getSpotifyAccessToken();

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

    const favoriteArtists = await favoriteArtistRes.json().catch(async () => {
      const body = await favoriteArtistRes.text().catch(() => '');
      console.error('Spotify Favorite Artists JSON parse error. Body was:', body);
      return null;
    });

    if (!favoriteArtists) {
      return NextResponse.json(
        { error: 'Failed to parse Spotify Favorite Artists JSON response.' },
        { status: 502 }
      );
    }

    return NextResponse.json(favoriteArtists);
  } catch (err) {
    const e = err as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
