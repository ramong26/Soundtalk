export const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.BASE_URL || '';
  }
  return process.env.BASE_URL || 'http://127.0.0.1:3000';
};

// 스포티파이 관련 URL을 가져오는 유틸리티 함수들
export const getSpotifyRedirectUri = (): string => {
  return process.env.NODE_ENV === 'production'
    ? (process.env.SPOTIFY_REDIRECT_URI_PROD ?? 'https://music-charts.vercel.app/api/auth/spotify/callback')
    : (process.env.SPOTIFY_REDIRECT_URI_DEV ?? 'http://127.0.0.1:3000/api/auth/spotify/callback');
};

// 구글 관련 URL을 가져오는 유틸리티 함수
export const getGoogleRedirectUri = (): string => {
  return process.env.NODE_ENV === 'production'
    ? (process.env.GOOGLE_REDIRECT_URI_PROD ?? 'https://music-charts.vercel.app/api/auth/google/callback')
    : (process.env.GOOGLE_REDIRECT_URI_DEV ?? 'http://127.0.0.1:3000/api/auth/google/callback');
};
