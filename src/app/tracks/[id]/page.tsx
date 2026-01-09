import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';
import TrackClient from '@/features/tracks/components/TrackClient';
import { getSpotifyAccessToken } from '@/lib/spotify/spotifyTokenManager';
import { cacheGet, cacheSet } from '@/lib/redis/redis';
import { Track, Album } from '@/shared/types/spotifyTrack';

export const metadata = {
  title: 'Track Page',
  description: 'Details about the track',
};

export const revalidate = 86400;

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

  try {
    // 1) Redis 캐시 확인
    const cachedRaw = await cacheGet(cachedKey);
    const cached = safeParseJSON<{ track: Track; album: Album }>(cachedRaw);

    if (cached?.track) {
      console.log('[TrackPage] Cache HIT');
      return cached;
    }

    console.log('[TrackPage] Cache MISS - fetching from Spotify');

    // 2) Spotify 토큰 발급
    const token = await getSpotifyAccessToken();
    if (!token) {
      console.error('[TrackPage] Failed to get Spotify token');
      return null;
    }

    // 3) 트랙 정보
    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!trackRes.ok) {
      console.error('[TrackPage] Spotify track fetch failed:', trackRes.status);
      return null;
    }

    const track = await trackRes.json();

    // 4) 앨범 정보
    let album: Album | null = null;
    const albumId = track?.album?.id;

    if (albumId) {
      const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (albumRes.ok) {
        album = await albumRes.json();
      }
    }

    const response = { track, album } as { track: Track; album: Album };

    // 5) 캐시 저장
    try {
      await cacheSet(cachedKey, JSON.stringify(response), ONE_DAY);
    } catch (e) {
      console.error('[TrackPage] Cache set failed:', e);
    }

    return response;
  } catch (error) {
    console.error('[TrackPage] getTrackData error:', error);
    return null;
  }
}

export default async function TrackPage({ params }: PageProps) {
  try {
    const { id } = await params;

    console.log('[TrackPage] Loading track:', id);

    if (!id) {
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold">잘못된 트랙 ID입니다</h2>
        </div>
      );
    }

    const data = await getTrackData(id);

    if (!data || !data.track || !data.album) {
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold mb-4">트랙 정보를 불러올 수 없습니다</h2>
        </div>
      );
    }

    const { album } = data;

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <TrackDescription album={album} />
        <TrackClient trackId={id} album={album} />
      </div>
    );
  } catch (error) {
    console.error('[TrackPage] Error:', error);
    return (
      <div className="text-center mt-10 text-red-500">
        <h2 className="text-2xl font-bold mb-4">예상치 못한 오류가 발생했습니다</h2>
      </div>
    );
  }
}
