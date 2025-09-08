import React from 'react';
import { TrackItem } from '@/shared/types/spotifyTrack';
import { useFetchArtistInterviews } from '@/features/playlist/hooks/PlaylistInterviewList/useFetchArtistInterviews';

import PlaylistArtistInterviewList from '@/features/playlist/components/PlaylistInterviewList/PlaylistArtistInterviewList';

interface PlaylistInterviewListProps {
  trackData?: TrackItem[];
}

function PlaylistInterviewList({ trackData }: PlaylistInterviewListProps) {
  const { artistInterviews, observerRef, isScrollLoading, artists, chunkSize, visibleChunks } =
    useFetchArtistInterviews({ trackData });

  if (!trackData || trackData.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">트랙 데이터를 불러오는 중이거나 없습니다.</p>
    );
  }

  return (
    <div className="pb-16 mt-12 w-full flex flex-col gap-8">
      {artists.slice(0, visibleChunks * chunkSize).map((artist) => (
        <PlaylistArtistInterviewList
          key={artist}
          artist={artist}
          interviews={artistInterviews[artist]}
        />
      ))}
      {isScrollLoading && <div className="text-center text-gray-500">로딩 중...</div>}
      {visibleChunks * chunkSize < artists.length && <div ref={observerRef} className="h-10" />}
    </div>
  );
}

export default React.memo(PlaylistInterviewList, (prev, next) => prev.trackData === next.trackData);
