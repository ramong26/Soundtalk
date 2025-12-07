// 클라이언트 측에서 Spotify API 토큰을 관리
import { getBaseUrl } from '@/lib/utils/baseUrl';

// 새로운 타입 정의
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface TokenCache {
  token: string;
  expiresAt: number;
}

// 개선된 코드
let tokenCache: TokenCache | null = null;

export async function getSpotifyAccessToken(): Promise<string> {
  try {
    // 캐시된 토큰이 유효한지 확인
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
      return tokenCache.token;
    }

    const baseUrl = getBaseUrl();
    const tokenRes = await fetch(`${baseUrl}/api/spotify/spotify-token`);
    
    if (!tokenRes.ok) {
      throw new Error(`Failed to fetch Spotify token: ${tokenRes.status} ${tokenRes.statusText}`);
    }
    
    const data: SpotifyTokenResponse = await tokenRes.json();
    
    if (!data.access_token) {
      throw new Error('No access token in response');
    }
    
    // 토큰과 만료 시간을 캐시 (expires_in은 초 단위)
    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 60초 여유
    };
    
    return tokenCache.token;
  } catch (error) {
    console.error('Spotify token fetch error:', error);
    // 에러 발생 시 캐시 무효화
    tokenCache = null;
    throw error;
  }
}
