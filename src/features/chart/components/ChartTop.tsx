import Image from 'next/image';

import InterviewList from '@/features/homepage/components/InterviewList';
import Miniplayer from '@/features/chart/components/Miniplayer';

import { TrackItem } from '@/shared/types/spotifyTrack';
import IframeYoutube from '@/features/chart/components/IframeYoutube';

export default async function ChartTop({ tracksList }: { tracksList: TrackItem[] }) {
  if (!tracksList || tracksList.length === 0) {
    return <div>트랙이 없습니다.</div>;
  }
  const topTrack = tracksList[0]?.track;
  const topArtistName = topTrack?.artists[0]?.name || 'Unknown Artist';
  return (
    <section className=" relative lg:mt-24 md:mt-16 mt-12 lg:gap-12 gap-8 lg:mx-auto mx-4  lg:p-8 md:p-6 p-4 flex md:flex-row flex-col items-center justify-between bg-[#fdfbf7] border-4 border-black shadow-[6px_6px_0px_#000] ">
      {/* 제목 박스 */}
      <h1 className="lg:text-2xl md:text-xl text-lg absolute -top-7 left-1/2 -translate-x-1/2 bg-[#FFD460] text-black px-8 py-2 border-3 border-black font-extrabold  tracking-wide shadow-md">
        🔥 Global Top 1
      </h1>

      <div className="mt-2 flex flex-col items-center justify-center w-full gap-12">
        {/* 유튜브 임베드 */}
        <IframeYoutube tracksList={tracksList} />

        {/* 미니 플레이어 */}
        <Miniplayer track={topTrack} />

        {/* 앨범 중심 레이아웃 */}
        <div className="flex flex-col lg:flex-row items-center w-full lg:gap-12 gap-8 ">
          {/* 앨범 사진 (중앙 강조) */}
          <div className=" relative group">
            <div className=" border-8 border-black shadow-[8px_8px_0px_#D65361] overflow-hidden ">
              <Image
                width={500}
                height={500}
                src={tracksList[0]?.track.album.images[0].url}
                alt="Album Cover"
                priority
              />
            </div>
            <div className="font-bold lg:text-xl md:text-sm text-xl lg:px-6 md:px-4 px-[12px] lg:py-2 py-1 absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#FFD460] text-black border-2 border-black shadow-[3px_3px_0px_#000]">
              #1 HIT
            </div>
          </div>

          {/* 타이틀 + 아티스트명 + 인터뷰 */}
          <div className="lg:w-[650px] md:w-[500px] max-w-[400px] lg:h-[500px] md:h-[400px] flex flex-col  items-center justify-between">
            <div className="flex flex-col items-center md:gap-4 gap-2 text-center">
              <h1 className="lg:text-[56px] text-[40px] font-extrabold leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
                {topArtistName}
              </h1>
              <p className="lg:text-[22px] text-[16px] font-medium md:pb-0 pb-4 text-gray-800 italic">
                {tracksList[0]?.track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
            <div className="lg:p-4 p-2 border-2 border-black  bg-white shadow-[4px_4px_0px_#000] w-full">
              <InterviewList className="w-full" slice={3} artistName={topArtistName} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
