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
    <div className="pb-16 mt-12 w-full flex gap-4 flex-col">
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

// import React from 'react';
// import { TrackItem } from '@/shared/types/spotifyTrack';
// import { useFetchArtistInterviews } from '@/features/playlist/hooks/PlaylistInterviewList/useFetchArtistInterviews';

// import PlaylistArtistInterviewList from '@/features/playlist/components/PlaylistInterviewList/PlaylistArtistInterviewList';

// interface PlaylistInterviewListProps {
//   trackData?: TrackItem[];
// }

// function PlaylistInterviewList({ trackData }: PlaylistInterviewListProps) {
//   const { artistInterviews, observerRef, isScrollLoading, artists, chunkSize, visibleChunks } =
//     useFetchArtistInterviews({ trackData });

//   if (!trackData || trackData.length === 0) {
//     return (
//       <p className="text-center text-gray-500 mt-10">트랙 데이터를 불러오는 중이거나 없습니다.</p>
//     );
//   }

//   return (
//     <div className="pb-16 mt-12 w-full">
//       <div className="relative border-4 border-black bg-[#fff9f0] w-full  rounded-2xl shadow-lg">
//         {/* 헤더 타이틀 */}

//         <h3 className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-2 border-4 border-black font-extrabold text-xl md:text-2xl rounded-lg tracking-wider">
//           아티스트 인터뷰 검색 결과
//         </h3>

//         <div className="space-y-8 mt-12 px-6 py-8">
//           {artists.slice(0, visibleChunks * chunkSize).map((artist) => (
//             <PlaylistArtistInterviewList
//               key={artist}
//               artist={artist}
//               interviews={artistInterviews[artist]}
//             />
//           ))}
//           {isScrollLoading && <div className="text-center text-gray-500">로딩 중...</div>}
//           {visibleChunks * chunkSize < artists.length && <div ref={observerRef} className="h-10" />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default React.memo(PlaylistInterviewList, (prev, next) => prev.trackData === next.trackData);
