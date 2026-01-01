'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

import { Album, TrackItem } from '@/shared/types/spotifyTrack';
import { useTrackStore } from '@/stores/trackStore';
import ImportTrack from '@/features/playlist/components/ImportTrack';

const TrackComments = dynamic(() => import('@/features/tracks/components/TrackComments/TrackComments'), { ssr: false });

export default function TrackClient({ album, trackId }: { album: Album; trackId: string }) {
  const { setAlbum, setTrackId } = useTrackStore();

  // 전역 상태 초기화
  useEffect(() => {
    setAlbum(album);
    setTrackId(trackId);
  }, [album, trackId, setAlbum, setTrackId]);

  const trackItems: TrackItem[] = album.tracks.items.map((item) => ({
    track: {
      ...item,
      album: album,
    },
  }));

  if (!album)
    return (
      <>
        <ImportTrack isLoading />
      </>
    );
  return (
    <>
      <ImportTrack tracksList={trackItems} link={true} />

      {/* 댓글 */}
      <TrackComments />
    </>
  );
}
