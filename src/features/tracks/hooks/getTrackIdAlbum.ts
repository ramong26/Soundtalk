import { Track, Album } from '@/shared/types/spotifyTrack';
import { getClientCredentialsToken } from '@/lib/spotify/spotifyTokenManager';

export default async function getTrackIdAlbum(track: Track | null): Promise<Album | null> {
  if (!track?.album?.id) return null;

  // 토큰 가져오기
  const token = await getClientCredentialsToken();
  // 스포티파이 API 호출
  const trackAlumRes = await fetch(`https://api.spotify.com/v1/albums/${track.album.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  // 에러 처리
  if (!trackAlumRes.ok) {
    throw new Error('Failed to fetch data');
  }

  // 데이터를 json 형식으로 변환
  const data = await trackAlumRes.json();
  return data;
}
