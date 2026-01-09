import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';
import TrackClient from '@/features/tracks/components/TrackClient';
import { getSpotifyAccessToken } from '@/lib/spotify/spotifyTokenManager';
import { cacheGet, cacheSet, cacheDel } from '@/lib/redis/redis';
import { Track, Album } from '@/shared/types/spotifyTrack';

export const metadata = {
  title: 'Track Page',
  description: 'Details about the track',
};

export const revalidate = 86400;

const ONE_DAY = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

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
    const cachedRaw = await cacheGet(cachedKey);
    const cached = safeParseJSON<{ track: Track; album: Album }>(cachedRaw);

    if (cached?.track) {
      return cached;
    }

    const token = await getSpotifyAccessToken();
    if (!token) {
      console.error('[TrackPage] Failed to obtain Spotify access token');
      return null;
    }

    const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!trackRes.ok) {
      console.error('[TrackPage] Spotify Track Fetch failed:', trackRes.status);
      return null;
    }

    const track = await trackRes.json();

    let album: Album | null = null;
    const albumId = track?.album?.id as string | undefined;

    if (albumId) {
      const albumRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (albumRes.ok) {
        album = await albumRes.json();
      }
    }

    const response = { track, album };

    try {
      await cacheSet(cachedKey, JSON.stringify(response), ONE_DAY);
    } catch (e) {
      console.error('[TrackPage] cacheSet failed:', e);
    }

    return response as { track: Track; album: Album };
  } catch (err) {
    console.error('[TrackPage] getTrackData error:', err);
    try {
      await cacheDel?.(cachedKey);
    } catch {}
    return null;
  }
}

export default async function TrackPage({ params }: PageProps) {
  const { id } = await params;

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
}
