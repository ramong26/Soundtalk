import { NextRequest, NextResponse } from 'next/server';
import { getClientCredentialsToken } from '@/lib/spotify/spotifyTokenManager';
import { cacheGet, cacheSet, cacheDel } from '@/lib/redis/redis';
import { Track, Album } from '@/shared/types/spotifyTrack';
const ONE_DAY = 86400;

function safeParseJSON<T = unknown>(raw: unknown): T | null {
  try {
    if (raw == null) return null;
    if (typeof raw === 'object') return raw as T;
    if (typeof raw !== 'string') return null;
    const s = raw.trim();
    if (!s) return null;
    return JSON.parse(s) as T;
  } catch {
    console.error('[tracks/[id]] Cached JSON parse failed. preview:', String(raw).slice(0, 200));
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: PageProps) {
  const { id } = await context.params;
  const cachedKey = `track:${id}:withAlbum`;

  console.log('GET /api/tracks/[id] called with id:', id);

  if (!id) {
    console.error('GET /api/tracks/[id] missing id parameter');
    return NextResponse.json({ error: 'Missing track ID' }, { status: 400 });
  }

  try {
    // 1) Redis 캐시 확인
    const cachedRaw = await cacheGet(cachedKey);
    const cached = safeParseJSON<{ track: Track; album: Album }>(cachedRaw);

    if (cached?.track) {
      return NextResponse.json(cached, { headers: { 'x-cache': 'HIT' } });
    }

    // 2) Spotify 토큰 발급
    const token = await getClientCredentialsToken();
    console.log('token', token);
    if (!token) {
      console.error('Failed to obtain Spotify access token');
      return NextResponse.json({ error: 'Failed to obtain Spotify access token' }, { status: 500 });
    }

    // 3) 트랙 정보 fetch
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!trackRes.ok) {
      const errBody = await trackRes.text().catch(() => '');
      console.error('Spotify Track Fetch failed:', trackRes.status, trackRes.statusText, errBody);
      return NextResponse.json(
        { error: `Spotify Track Fetch failed: ${trackRes.status} ${trackRes.statusText}` },
        { status: trackRes.status }
      );
    }

    const track = await trackRes.json().catch(async () => {
      const body = await trackRes.text().catch(() => '');
      console.error('Spotify Track JSON parse error. Body was:', body);
      return null;
    });

    if (!track) {
      return NextResponse.json({ error: 'Failed to parse Spotify track JSON response.' }, { status: 502 });
    }

    // 4) 앨범 정보
    let album: Album | null = null;
    const albumId = track?.album?.id as string | undefined;

    if (albumId) {
      const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (albumRes.ok) {
        album = await albumRes.json().catch(async () => {
          const body = await albumRes.text().catch(() => '');
          console.error('Spotify Album JSON parse error. Body was:', body);
          return null;
        });
      } else {
        const body = await albumRes.text().catch(() => '');
        console.error('Spotify Album Fetch failed:', albumRes.status, albumRes.statusText, body);
      }
    }

    const response = { track, album };
    try {
      await cacheSet(cachedKey, JSON.stringify(response), ONE_DAY);
    } catch (e) {
      console.error('cacheSet failed:', e);
    }

    return NextResponse.json(response, { headers: { 'x-cache': 'MISS' } });
  } catch (err) {
    console.error('GET /api/tracks/[id] fatal error:', { id, err });
    try {
      await cacheDel?.(cachedKey);
    } catch {}

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
