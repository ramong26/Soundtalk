import Image from 'next/image';
import Link from 'next/link';

import InterviewList from '@/features/homepage/components/InterviewList';
import Miniplayer from '@/features/chart/components/Miniplayer';
import IframeYoutube from '@/features/chart/components/IframeYoutube';

import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';
import { ChartComponentProps } from './types';

export const metadata = {
  title: 'Music Charts',
  description: 'Explore the top music tracks and albums',
};

export const revalidate = 86400;

export default async function Charts() {
  const tracksList = await getTopTrackPlaylist({ playlistId: '1PcB3QM5sGbzFU5D9CbEGB' });
  const koreaTracksList = await getTopTrackPlaylist({
    playlistId: '1Gg5BI7b5xljyHnGXXrX0E',
  });
  const usaTracksList = await getTopTrackPlaylist({
    playlistId: '0TyhU3nPbWY8BNObcPXt4u',
  });

  const topTrack = tracksList[0]?.track;
  const topArtistName = topTrack?.artists[0]?.name || 'Unknown Artist';

  const renderChart = ({ tracksList, title, className = '' }: ChartComponentProps) => {
    return (
      <div
        className={`relative lg:p-8 md:p-6 p-4 border-4 border-black bg-[#fdfbf7] shadow-[6px_6px_0px_#000000]  mt-20 w-full max-w-[572px] ${className}
      `}
      >
        <h2 className="font-extrabold lg:text-2xl md:text-xl text-lg absolute -top-7 left-1/2 -translate-x-1/2 bg-[#FFD460] text-black px-8 py-2 border-3 border-black  uppercase flex items-center gap-2">
          {title}
        </h2>
        <div className="flex flex-col gap-6 mt-4">
          {tracksList.map((item, index) => (
            <Link
              key={item.track.id}
              href={`/tracks/${item.track.id}`}
              className={`flex items-center gap-6 mb-2 p-4 bg-white border-3 border-black shadow-[4px_4px_0px_#000] cursor-pointer transition-transform hover:-translate-y-1 hover:scale-[1.03] last:border-b-0`}
            >
              <div className="relative flex items-center">
                <div className="absolute -top-3 -left-3 bg-black text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_#FFD460]">
                  {index + 1}
                </div>
                <Image
                  src={item.track.album.images[0].url}
                  alt={item.track.name}
                  width={100}
                  height={100}
                  className="rounded-lg border-3 border-black shadow-[4px_4px_0px_#D65361] bg-white"
                />
              </div>
              <div className="lg:w-[300px] w-[200px] lg:h-[100px] h-[70px] flex flex-col justify-center overflow-hidden  text-black">
                <div className="font-bold text-lg break-words max-w-xs uppercase truncate">{item.track.name}</div>
                <div className="text-md text-gray-700 italic break-words max-w-xs truncate">
                  {item.track.artists.map((artist) => artist.name).join(', ')}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  if (!tracksList && !koreaTracksList && !usaTracksList) return null;

  return (
    <div className=" flex flex-col items-center justify-center  mx-4 ">
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

          <div className="flex flex-col lg:flex-row items-center w-full lg:gap-12 gap-8 ">
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

      <section className="max-w-[1036px] flex lg:flex-row flex-col items-center justify-between  w-full gap-10 pb-10">
        {renderChart({ tracksList: koreaTracksList, title: '#한국 Top 50' })}
        {renderChart({ tracksList: usaTracksList, title: '#미국 Top 50' })}
      </section>
    </div>
  );
}
