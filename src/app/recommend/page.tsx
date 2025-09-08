import TodayMusic from '@/features/recommend/components/TodayMusic';

export const metadata = {
  title: 'Music Recommendation',
  description: 'Discover new music tailored for you',
};

export const revalidate = 86400;

export default function Recommend() {
  return (
    <div className="flex flex-col mt-24 max-w-fit gap-4 h-screen mx-auto">
      <TodayMusic />
    </div>
  );
}
