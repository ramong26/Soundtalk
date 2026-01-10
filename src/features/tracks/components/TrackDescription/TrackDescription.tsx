import Image from 'next/image';

import fetchWikiInfo from '@/features/tracks/hooks/TrackDescription/fetchWikiInfo';
import { Album } from '@/shared/types/spotifyTrack';

import TrackCommentsSkeleton from '@/features/tracks/components/TrackClient/TrackCommentsSkeleton';
import TrackPageShare from '@/features/tracks/components/TrackDescription/TrackPageShare';

export default async function TrackDescription({ album }: { album: Album }) {
  // 앨범 정보를 위키피디아를 통해 가져옴
  const summary = await fetchWikiInfo({ album });

  if (!album) {
    return <TrackCommentsSkeleton />;
  }
  return (
    <section>
      <h1 className="flex items-center justify-center mb-5 text-center lg:text-5xl md:text-4xl text-3xl font-extrabold leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
        TRACK INFO !
      </h1>

      <div className="lg:gap-12 gap-8 lg:w-fit lg:p-8 md:p-6 p-4 flex md:flex-row flex-col mb-12 items-center justify-between bg-[#fdfbf7] border-4 border-black shadow-[6px_6px_0px_#000]">
        {/* 앨범 이미지 */}
        <div className=" relative">
          <div className="rounded-full border-8 border-black shadow-[8px_8px_0px_#D65361] overflow-hidden">
            <Image
              width={500}
              height={500}
              src={album?.images?.[0]?.url}
              alt={`Album cover of ${album?.name}`}
              priority
              className="rounded-full "
            />
          </div>
        </div>

        {/* 설명 영역 */}
        <div className="lg:h-[478px] md:h-[300px] h-[200px] flex flex-col gap-10 max-w-2xl ">
          <div className="flex justify-between items-center ">
            <h2
              className="lg:text-3xl md:text-2xl text-xl lg:w-[420px] md:w-[350px] w-[265px] font-extrabold truncate uppercase max-w-[600px] overflow-hidden whitespace-nowrap text-ellipsis"
              title={album.name}
            >
              {album.name}
            </h2>
            <TrackPageShare />
          </div>
          <p className="lg:text-lg md:text-sm text-xs leading-relaxed italic text-gray-800">{summary}</p>
        </div>
      </div>
    </section>
  );
}
