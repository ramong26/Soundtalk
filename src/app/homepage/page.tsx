import Link from 'next/link';
import { ErrorBoundary, Suspense } from '@suspensive/react';

import InterviewList from '@/features/homepage/components/InterviewList';
import CharTopCircle from '@/features/homepage/components/CharTopCircle';
import YoutubePlaylist from '@/features/homepage/components/YoutubeChannel/YoutubeChannelsContainer';
import ChartItem from '@/features/homepage/components/ChartItem/ChartItem';

import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';
import { Track, TrackItem } from '@/shared/types/spotifyTrack';

export const metadata = {
  title: 'SoundTalk - 음악 차트 & 플레이리스트',
  description: '최신 음악 차트와 추천 플레이리스트를 만나보세요',
};

export const revalidate = 86400;

export default async function HomePage() {
  const tracksList = await getTopTrackPlaylist({ playlistId: '0TyhU3nPbWY8BNObcPXt4u', limit: 5 });
  const track = tracksList[0].track;

  return (
    <>
      <ErrorBoundary fallback={<div className="h-[300px] lg:h-[700px] w-full bg-[#f0eadc] animate-pulse mt-10" />}>
        <Suspense fallback={<div className="h-[300px] lg:h-[700px] w-full bg-[#f0eadc] animate-pulse mt-10" />}>
          <CharTopOne track={track} />
          <ChartTopFive tracksList={tracksList} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<div className="h-[300px] lg:h-[700px] w-full bg-[#f0eadc] animate-pulse mt-10" />}>
        <Suspense fallback={<div className="h-[300px] lg:h-[700px] w-full bg-[#f0eadc] animate-pulse mt-10" />}>
          <YoutubePlaylist />
        </Suspense>
      </ErrorBoundary>

      <Footer />
    </>
  );
}

interface CharTopOneProps {
  track: Track;
}
function CharTopOne({ track }: CharTopOneProps) {
  return (
    <section className="lg:mt-24 md:mt-16 mt-12 lg:gap-12 gap-8 lg:mx-auto mx-4 lg:w-fit lg:p-8 md:p-6 p-4 flex md:flex-row flex-col items-center justify-between bg-[#fdfbf7] border-4 border-black shadow-[6px_6px_0px_#000] ">
      <CharTopCircle track={track} />

      <div className="lg:w-[650px] md:w-[500px] w-full lg:h-[500px] md:h-[400px] flex flex-col  items-center justify-between">
        <div className="flex flex-col items-center md:gap-4 gap-2 text-center">
          <h1 className="lg:text-[56px] text-[40px] font-extrabold leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
            {track.name}
          </h1>
          <p className="lg:text-[22px] text-[16px] font-medium md:pb-0 pb-4 text-gray-800 italic">
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
  );
}

interface ChartTopFiveProps {
  tracksList: TrackItem[];
}
function ChartTopFive({ tracksList }: ChartTopFiveProps) {
  return (
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
          <ChartItem key={track?.track?.id} track={track} index={index} />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
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
    </footer>
  );
}
