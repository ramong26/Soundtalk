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
    console.error('[getTrackData] Cached JSON parse failed. preview:', String(raw).slice(0, 200));
    return null;
  }
}

export async function getTrackData(id: string): Promise<{ track: Track | null; album: Album | null }> {
  const cachedKey = `track:${id}:withAlbum`;

  console.log('[getTrackData] called with id:', id);

  if (!id) {
    console.error('[getTrackData] missing id parameter');
    throw new Error('Missing track ID');
  }

  try {
    // 1) Redis 캐시 확인
    const cachedRaw = await cacheGet(cachedKey);
    const cached = safeParseJSON<{ track: Track; album: Album }>(cachedRaw);

    if (cached?.track) {
      console.log('[getTrackData] Cache HIT for id:', id);
      return cached;
    }

    console.log('[getTrackData] Cache MISS for id:', id);

    // 2) Spotify 토큰 발급
    const token = await getClientCredentialsToken();
    console.log('[getTrackData] token obtained');

    if (!token) {
      console.error('[getTrackData] Failed to obtain Spotify access token');
      throw new Error('Failed to obtain Spotify access token');
    }

    // 3) 트랙 정보 fetch
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!trackRes.ok) {
      const errBody = await trackRes.text().catch(() => '');
      console.error('[getTrackData] Spotify Track Fetch failed:', trackRes.status, trackRes.statusText, errBody);
      throw new Error(`Spotify Track Fetch failed: ${trackRes.status} ${trackRes.statusText}`);
    }

    const track = await trackRes.json().catch(async () => {
      const body = await trackRes.text().catch(() => '');
      console.error('[getTrackData] Spotify Track JSON parse error. Body was:', body);
      return null;
    });

    if (!track) {
      throw new Error('Failed to parse Spotify track JSON response.');
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
          console.error('[getTrackData] Spotify Album JSON parse error. Body was:', body);
          return null;
        });
      } else {
        const body = await albumRes.text().catch(() => '');
        console.error('[getTrackData] Spotify Album Fetch failed:', albumRes.status, albumRes.statusText, body);
      }
    }

    const response = { track, album };

    // 5) 캐시 저장
    try {
      await cacheSet(cachedKey, JSON.stringify(response), ONE_DAY);
      console.log('[getTrackData] Cached successfully for id:', id);
    } catch (e) {
      console.error('[getTrackData] cacheSet failed:', e);
    }

    return response;
  } catch (err) {
    console.error('[getTrackData] fatal error:', { id, err });

    // 에러 시 캐시 삭제
    try {
      await cacheDel?.(cachedKey);
    } catch {}

    throw err;
  }
}
