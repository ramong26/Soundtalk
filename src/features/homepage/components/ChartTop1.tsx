import Image from 'next/image';

import InterviewList from '@/features/homepage/components/InterviewList';

import { TrackItem } from '@/shared/types/spotifyTrack';

export default function ChartTop1({ tracksList }: { tracksList: TrackItem[] }) {
  if (!tracksList || tracksList.length === 0 || !tracksList[0]?.track) return null;
  const track = tracksList[0].track;
  return (
    <section className="lg:mt-24 md:mt-16 mt-12 lg:gap-12 gap-8 lg:mx-auto mx-4 lg:w-fit lg:p-8 md:p-6 p-4 flex md:flex-row flex-col items-center justify-between bg-[#fdfbf7] border-4 border-black shadow-[6px_6px_0px_#000] ">
      {/* 앨범 커버*/}
      <div className=" relative group">
        <div className="rounded-full border-8 border-black shadow-[8px_8px_0px_#D65361] overflow-hidden">
          <Image
            width={500}
            height={500}
            src={track.album?.images?.[0]?.url}
            alt={`Album cover of ${track.name}`}
            priority
            className="rounded-full group-hover:rotate-6 transition-transform duration-500"
          />
        </div>
        <div className="font-bold lg:text-xl md:text-sm text-xl lg:px-6 md:px-4 px-[12px] lg:py-2 py-1 absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#FFD460] text-black border-2 border-black shadow-[3px_3px_0px_#000]">
          #1 HIT
        </div>
      </div>

      {/* 1등 노래 + 해당 관련 인터뷰 */}
      <div className="lg:w-[650px] md:w-[500px] w-full lg:h-[500px] md:h-[400px] flex flex-col  items-center justify-between">
        <div className="flex flex-col items-center md:gap-4 gap-2 text-center">
          <h1 className="lg:text-[56px] text-[40px] font-extrabold leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
            {track.name}
          </h1>
          <p className="lg:text-[22px] text-16px font-medium md:pb-0 pb-4 text-gray-800 italic">
            {track.artists?.map((artist) => artist.name).join(', ')}
          </p>
        </div>
        <div className="lg:p-4 p-2 border-2 border-black  bg-white shadow-[4px_4px_0px_#000] w-full">
          <InterviewList className="w-full" slice={3} />
        </div>
      </div>
    </section>
  );
}
