import { TrackItem } from '@/shared/types/spotifyTrack';
// import { getBaseUrl } from '@/lib/utils/baseUrl';
import { getSpotifyToken } from '@/lib/spotify/getSpotifyToken';

export default async function getTopTrackPlaylist({
  playlistId,
  offset = 0,
  limit = 50,
}: {
  playlistId: string;
  offset?: number;
  limit?: number;
}): Promise<TrackItem[]> {
  // const baseUrl = getBaseUrl();

  const access_token = await getSpotifyToken();

  const playlistRes = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-store',
    }
  );

  if (!playlistRes.ok) {
    console.error('Error fetching playlist:', await playlistRes.text());
    throw new Error('Failed to fetch playlist');
  }

  const data = await playlistRes.json();

  return data.items;
}
