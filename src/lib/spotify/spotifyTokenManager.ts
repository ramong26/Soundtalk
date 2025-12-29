// 클라이언트 측에서 Spotify API 토큰을 관리
import { getBaseUrl } from '@/lib/utils/baseUrl';
let cachedToken: string | null = null;

export async function getSpotifyAccessToken() {
  const baseUrl = getBaseUrl();

  const tokenRes = await fetch(`${baseUrl}/api/spotify/spotify-token`);

  if (!tokenRes.ok) {
    throw new Error('Failed to fetch Spotify token');
  }

  const data = await tokenRes.json();

  cachedToken = data.access_token;

  return cachedToken;
}
