'use server';
import { TrackItem } from '@/shared/types/spotifyTrack';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export default async function getTopTrackPlaylist({
  playlistId,
  offset = 0,
  limit = 50,
}: {
  playlistId: string;
  offset?: number;
  limit?: number;
}): Promise<TrackItem[]> {
  const getAccessToken = async () => {
    const now = Date.now();
    if (cachedToken && tokenExpiresAt > now) {
      return cachedToken;
    }
    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      console.error('Spotify environment variables are missing');
      throw new Error('Spotify environment variables are missing');
    }

    const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString(
      'base64'
    );

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      console.error('Spotify environment variables are missing');
      throw new Error('Spotify env missing');
    }

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(await response.text());
      throw new Error('Failed to fetch Spotify token in getSpotifyToken');
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in - 60) * 1000;
    return cachedToken;
  };

  const playlistRes = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
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
