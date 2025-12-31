import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import InterviewList from '@/features/homepage/components/InterviewList';
import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';

import YoutubePlaylist from '@/features/homepage/components/YoutubeChannel/YoutubeChannelsContainer';

export const metadata = {
  title: 'SoundTalk - 음악 차트 & 플레이리스트',
  description: '최신 음악 차트와 추천 플레이리스트를 만나보세요',
};

export const revalidate = 86400;

export default async function HomePage() {
  const tracksList = await getTopTrackPlaylist({ playlistId: '1PcB3QM5sGbzFU5D9CbEGB', limit: 5 });
  const track = tracksList[0].track;

  if (!track) return null;

  return (
    <>
      {/* ChartTop1 */}
      <section className="lg:mt-24 md:mt-16 mt-12 lg:gap-12 gap-8 lg:mx-auto mx-4 lg:w-fit lg:p-8 md:p-6 p-4 flex md:flex-row flex-col items-center justify-between bg-[#fdfbf7] border-4 border-black shadow-[6px_6px_0px_#000] ">
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
            <InterviewList
              className="w-full"
              slice={3}
              artistName={track.artists?.map((artist) => artist.name).join(', ')}
            />
          </div>
        </div>
      </section>

      {/* ChartTop5 */}
      <section className="w-full mt-16">
        <div className="lg:text-3xl md:text-2xl text-lg font-extrabold md:px-[50px] px-[15px] h-[70px] flex items-center text-black  bg-[#FFD460] border-t-4 border-b-4 border-black justify-between shadow-[0_4px_0_#000] uppercase tracking-wide">
          <div>🔥 TOP 5 TRACKS</div>
          <Link
            href="/charts"
            className="lg:text-2xl md:text-xl text-md font-bold underline hover:text-[#D65361] transition-colors"
          >
            Go Charts →
          </Link>
        </div>

        <div className="flex h-fit md:px-6 px-2 md:pt-8 pt-4  py-4 w-full bg-[#fdfbf7] border-x-4 border-b-4 border-black">
          {tracksList.slice(0, 5).map((track, index) => (
            <Link key={track?.track?.id} href={`/tracks/${track?.track?.id}`} className="w-1/5">
              <div
                className={`md:px-3 px-2 flex flex-col items-center gap-4 cursor-pointer  hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
                  index !== 4 ? 'border-r-2 border-dashed border-black/50' : ''
                }`}
              >
                <div className="relative">
                  <Image
                    src={track?.track?.album?.images?.[1]?.url || track?.track?.album?.images?.[0]?.url}
                    alt={track?.track?.name}
                    width={150}
                    height={150}
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 150px"
                    className=" w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] max-w-full max-h-full rounded-lg border-4 border-black shadow-[5px_5px_0px_#D65361] hover:scale-105 transition-transform"
                  />
                  <div className=" lg:h-8 h-6 lg:w-8 w-6  absolute -top-3 -left-3 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_#FFD460]">
                    {index + 1}
                  </div>
                </div>
                <div className="flex flex-col items-center text-black gap-1 text-center">
                  <div className="text-xs sm:text-sm md:text-base lg:text-lg max-w-[60px] sm:max-w-[60px] md:max-w-[140px] lg:max-w-[180px] font-bold truncate uppercase">
                    {track?.track?.name}
                  </div>

                  <div className=" text-xs sm:text-sm md:text-md lg:text-lg max-w-[60px] sm:max-w-[60px] md:max-w-[140px] lg:max-w-[180px] text-gray-700 truncate italic">
                    {track?.track?.artists?.map((artist) => artist.name).join(', ')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Suspense fallback={<div className="h-[700px] w-full bg-gray-200 animate-pulse mt-10" />}>
        <YoutubePlaylist />
      </Suspense>

      {/* Footer */}
      <footer className="md:h-[200px] h-[150px] md:py-12 md:px-12 py-6 px-6 flex flex-col md:flex-row items-center justify-between md:gap-4 gap-2 bg-[#F0EADC] text-black  ">
        <div className="md:text-4xl text-2xl font-bold tracking-wider">SoundTalk</div>
        <div className="md:text-2xl text-xl flex gap-6 text-black">
          <Link href="/about" className="hover:underline hover:text-gray-500 transition">
            About
          </Link>
          <Link href="/contact" className="hover:underline hover:text-gray-500 transition">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline hover:text-gray-500 transition">
            Privacy
          </Link>
        </div>

        <div className="flex gap-4">
          <Link
            href="https://github.com/ramong26/Soundtalk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500 transition"
          >
            <svg className="md:w-10 md:h-10 w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-500 transition"
          >
            <svg className="md:w-10 md:h-10 w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </Link>
        </div>
      </footer>
    </>
  );
}
