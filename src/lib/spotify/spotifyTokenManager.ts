import { getBaseUrl } from '@/lib/utils/baseUrl';

let cachedToken: string | null = null;

export async function getSpotifyAccessToken() {
  const baseUrl = getBaseUrl();

  const tokenRes = await fetch(`${baseUrl}/api/spotify/spotify-token`);

  if (!tokenRes.ok) {
    throw new Error('Failed to fetch Spotify token in spotifyTokenManager');
  }

  const data = await tokenRes.json();

  cachedToken = data.access_token;

  return cachedToken;
}
