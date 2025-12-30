import { Track } from '@/shared/types/spotifyTrack';
import { getBaseUrl } from '@/lib/utils/baseUrl';

export default async function getTrackId(trackId?: string): Promise<Track> {
  const baseUrl = getBaseUrl();

  const tokenRes = await fetch(`${baseUrl}/api/spotify/spotify-token`, {
    cache: 'no-store',
  });

  if (!tokenRes.ok) {
    throw new Error('Failed to fetch Spotify token in getTrackId');
  }

  const { access_token } = await tokenRes.json();

  const trackRes = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: 'no-store',
  });

  if (!trackRes.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await trackRes.json();
  return data;
}
