'use client';
import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';

import { Album } from '@/shared/types/spotifyTrack';
import { useTrackStore } from '@/stores/trackStore';
import ImportTrack from '@/features/playlist/components/ImportTrack';

const TrackComments = dynamic(
  () => import('@/features/tracks/components/TrackComments/TrackComments'),
  { ssr: false }
);

export default function TrackClient({ album, trackId }: { album: Album; trackId: string }) {
  const { setAlbum, setTrackId } = useTrackStore();

  // 전역 상태 초기화
  useEffect(() => {
    setAlbum(album);
    setTrackId(trackId);
  }, [album, trackId, setAlbum, setTrackId]);

  // 이미지는 따로 빼서 사용
  const albumImages = album?.images[1].url ?? '';

  // 제네릭 매퍼 함수
  const mappedTracks = useMemo(
    () =>
      (album?.tracks?.items ?? []).map((item) => ({
        id: item.id,
        imageUrl: albumImages || '/images/placeholder.png',
        title: item.name,
        subtitle: item.artists.map((a) => a.name).join(', '),
      })),
    [album, albumImages]
  );

  if (!album) return <div>Loading...</div>;
  return (
    <>
      <ImportTrack tracksList={mappedTracks} link={true} />

      {/* 댓글 */}
      <TrackComments />
    </>
  );
}
