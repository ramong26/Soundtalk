import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';
import TrackClient from '@/features/tracks/components/TrackClient';
import { getSpotifyAccessToken } from '@/lib/spotify/spotifyTokenManager';
import { cacheGet, cacheSet } from '@/lib/redis/redis';
import { Track, Album } from '@/shared/types/spotifyTrack';

export const metadata = {
  title: 'Track Page',
  description: 'Details about the track',
};

// 캐시 비활성화
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

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
    return null;
  }
}

async function getTrackData(id: string): Promise<{ track: Track; album: Album } | null> {
  const cachedKey = `track:${id}:withAlbum`;

  console.log('[TrackPage getTrackData] START for ID:', id);

  try {
    // 1) Redis 캐시 확인
    try {
      const cachedRaw = await cacheGet(cachedKey);
      const cached = safeParseJSON<{ track: Track; album: Album }>(cachedRaw);

      if (cached?.track) {
        console.log('[TrackPage] ✅ Cache HIT for:', id);
        return cached;
      }
    } catch (e) {
      console.warn('[TrackPage] Redis error, continuing:', e);
    }

    console.log('[TrackPage] ❌ Cache MISS - fetching from Spotify for:', id);

    // 2) Spotify 토큰 발급
    const token = await getSpotifyAccessToken();
    if (!token) {
      console.error('[TrackPage] ❌ Failed to get Spotify token');
      return null;
    }

    console.log('[TrackPage] ✅ Got Spotify token');

    // 3) 트랙 정보
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    console.log('[TrackPage] Track fetch status:', trackRes.status);

    if (!trackRes.ok) {
      console.error('[TrackPage] ❌ Spotify track fetch failed:', trackRes.status, trackRes.statusText);
      return null;
    }

    const track = await trackRes.json();
    console.log('[TrackPage] ✅ Got track:', track.name);

    // 4) 앨범 정보
    let album: Album | null = null;
    const albumId = track?.album?.id;

    if (albumId) {
      console.log('[TrackPage] Fetching album:', albumId);
      const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      console.log('[TrackPage] Album fetch status:', albumRes.status);

      if (albumRes.ok) {
        album = await albumRes.json();
        console.log('[TrackPage] ✅ Got album:', album?.name);
      } else {
        console.error('[TrackPage] ❌ Album fetch failed');
      }
    }

    const response = { track, album } as { track: Track; album: Album };

    // 5) 캐시 저장
    try {
      await cacheSet(cachedKey, JSON.stringify(response), ONE_DAY);
      console.log('[TrackPage] ✅ Cache saved for:', id);
    } catch (e) {
      console.error('[TrackPage] Cache set failed:', e);
    }

    return response;
  } catch (error) {
    console.error('[TrackPage] ❌ FATAL ERROR in getTrackData:', error);
    return null;
  }
}

export default async function TrackPage({ params }: PageProps) {
  const startTime = Date.now();

  try {
    const { id } = await params;

    console.log('='.repeat(80));
    console.log('[TrackPage] 🚀 START - Track ID:', id);
    console.log('[TrackPage] Timestamp:', new Date().toISOString());
    console.log('='.repeat(80));

    if (!id) {
      console.error('[TrackPage] ❌ Missing ID');
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold">잘못된 트랙 ID입니다</h2>
        </div>
      );
    }

    const data = await getTrackData(id);

    if (!data || !data.track || !data.album) {
      console.error('[TrackPage] ❌ No data returned');
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold mb-4">트랙 정보를 불러올 수 없습니다</h2>
        </div>
      );
    }

    const { album } = data;

    const elapsed = Date.now() - startTime;
    console.log('[TrackPage] ✅ SUCCESS - Rendered in', elapsed, 'ms');
    console.log('='.repeat(80));

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <TrackDescription album={album} />
        <TrackClient trackId={id} album={album} />
      </div>
    );
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error('[TrackPage] ❌ ERROR after', elapsed, 'ms:', error);
    console.error('[TrackPage] Error stack:', error instanceof Error ? error.stack : 'No stack');

    return (
      <div className="text-center mt-10 text-red-500">
        <h2 className="text-2xl font-bold mb-4">예상치 못한 오류가 발생했습니다</h2>
        <p className="text-sm">{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}
