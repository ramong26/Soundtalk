import { useEffect, useState } from 'react';

import RecommendCard from '@/features/recommend/components/RecommendCard';
import { getTrackList } from '@/shared/hooks/getTrackList';
import { TrackItem } from '@/shared/types/spotifyTrack';

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
  const [tracks, setTracks] = useState<TrackItem[]>([]);

  // 플레이리스트 ID에 따라 트랙 리스트를 가져오는 함수
  useEffect(() => {
    const playlistId = moodTagMap[tag];
    if (!playlistId) return;

    const fetchTracks = async () => {
      const res = await getTrackList({ playlistId });

      setTracks(res);
    };

    fetchTracks();
  }, [tag]);

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
        {tracks.map((track) => (
          <RecommendCard key={track.track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
