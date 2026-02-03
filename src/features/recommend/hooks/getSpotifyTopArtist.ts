'use server';

import { getClientCredentialsToken } from '@/lib/spotify/spotifyTokenManager';

export async function getSpotifyTopArtist(userToken?: string) {
  const token = userToken || (await getClientCredentialsToken());

  const res = await fetch('https://api.spotify.com/v1/me/top/artists?limit=1', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  const data = await res.json();
  return data.items[0];
}
