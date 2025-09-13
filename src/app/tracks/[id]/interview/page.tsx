import { Suspense } from 'react';
import getTrackId from '@/features/tracks/hooks/getTrackId';
import getArtist from '@/features/tracks/hooks/getArtist';

import ArtistProfile from '@/features/tracks/interview/components/ArtistProfile';
import ArtistInterview from '@/features/tracks/interview/components/ArtistInterview';

export const metadata = {
  title: 'Artist Interview',
  description: 'Interview with the artist',
};

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InterviewPage({ params }: PageProps) {
  const { id } = await params;
  const trackId = id;

  const track = await getTrackId(trackId);
  const artistId = track.artists[0]?.id;

  if (!artistId) {
    return <div className="text-center mt-10">아티스트 정보를 찾을 수 없습니다.</div>;
  }

  const artist = await getArtist(artistId);

  return (
    <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
      {/* 제목 */}
      <h1 className="lg:text-[56px] text-[40px] font-extrabold flex items-center justify-center leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
        Artist Wiki
      </h1>

      <ArtistProfile artist={artist} />

      <div className="text-xl mt-32 relative top-[-24px] lg:text-2xl md:text-xl font-extrabold px-[10px] h-[54px] flex items-center text-black bg-[#FFD460] border-t-[6px] border-b-4 border-black shadow-[0_4px_0_#000] uppercase tracking-wide">
        <div>Interview List 🔥</div>
      </div>
      <Suspense fallback={<div className="h-40 w-full bg-gray-200 animate-pulse mt-10" />}>
        <ArtistInterview artist={artist} />
      </Suspense>
    </div>
  );
}
