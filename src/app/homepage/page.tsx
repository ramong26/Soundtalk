import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import ChartTop5 from '@/features/homepage/components/ChartTop5';
import ChartTop1 from '@/features/homepage/components/ChartTop1';

import { getTrackList } from '@/shared/hooks/getTrackList';

const YoutubePlaylist = dynamic(
  () => import('@/features/homepage/components/YoutubeChannelsContainer')
);
const HomepageFooter = dynamic(() => import('@/features/homepage/components/HomepageFooter'));

export const metadata = {
  title: 'SoundTalk - 음악 차트 & 플레이리스트',
  description: '최신 음악 차트와 추천 플레이리스트를 만나보세요',
};

export const revalidate = 86400;

export default async function HomePage() {
  const tracksList = await getTrackList({ playlistId: '1PcB3QM5sGbzFU5D9CbEGB', limit: 5 });

  return (
    <>
      <ChartTop1 tracksList={tracksList} />
      <ChartTop5 tracksList={tracksList} />
      <Suspense fallback={<div className="h-[700px] w-full bg-gray-200 animate-pulse mt-10" />}>
        <YoutubePlaylist />
      </Suspense>
      <Suspense fallback={<div className="h-[200px] w-full bg-gray-200 animate-pulse mt-10" />}>
        <HomepageFooter />
      </Suspense>
    </>
  );
}
