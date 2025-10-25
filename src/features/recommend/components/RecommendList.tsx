'use client';
import { useRouter, useSearchParams } from 'next/navigation';

import RecommendCard from '@/features/recommend/components/RecommendCard';
import { usePaginatedTrackList } from '@/shared/hooks/getTrackList';

interface MoodTagProps {
  tag: string;
}
const moodTagMap: Record<string, string> = {
  Chill: '3vz8DopD29nRgCho92VKfa',
  HipHop: '2hHkPUMH6Ul5AUyXSaltcM',
  Jazz: '4ciHL9ecTiieBxjf8YIaaR',
  Pop: '7lkbq5hls1txKUUGb7Fu6m',
  KPop: '59A5G8RRyG1tjND3x3zsyW',
  Rock: '6kVEeyek3h3P1eZZMxRQgD',
  Classical: '3INeJ9z2wVrhyz49e9Ximl',
};

export default function RecommendList({ tag }: MoodTagProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const playlistId = moodTagMap[tag];

  const { data: tracks, isLoading, error } = usePaginatedTrackList(playlistId, currentPage, 16);

  const goToPage = (page: number) => {
    router.replace(`?page=${page}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between bg-[#FFD460] border-y-4 border-black px-6 py-3 mb-8">
        <h2 className="lg:text-2xl md:text-lg text-md font-extrabold uppercase text-black tracking-tight">
          Recommended For You
        </h2>
        <span className="lg:text-3xl md:text-2xl text-xl font-extrabold text-[#d43c3c] uppercase">
          {tag}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {tracks?.map((track) => (
          <RecommendCard key={track.track.id} track={track} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-10">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
        >
          이전
        </button>
        <span className="px-4 py-2">Page {currentPage}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={!tracks || tracks.length < 16}
          className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
