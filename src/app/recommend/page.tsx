import TodayMusic from '@/features/recommend/components/TodayMusic';

import { getFmTopArtist } from '@/features/recommend/hooks/getFmTopArtist';

export const metadata = {
  title: 'Music Recommendation',
  description: 'Discover new music tailored for you',
};

export const revalidate = 86400;

export default function Recommend() {
  const res = getFmTopArtist();

  console.log('res', res);
  return (
    <div className="flex flex-col mt-24 max-w-fit gap-4 h-screen mx-auto">
      <TodayMusic />
    </div>
  );
}
