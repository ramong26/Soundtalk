'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

import ChannelListSkeleton from '@/features/channel/components/ChannelList/ChannelListSkeleton';

import { ChannelListProps, ChannelMapping } from './types';
import { YouTubeChannel } from '@/shared/types/youtube';

const channelHandleMap: ChannelMapping = {
  '믹스 채널 추천': ['RAPHAEL_MIXES', 'retapestudios', 'HumanoStudios'],
  'Jazz 채널 추천': ['ICYFOG', 'midnightradio2', 'RetroCafeRadio'],
  'Hiphop 채널 추천': ['peddlermusic'],
  'Rock 채널 추천': ['On8ight'],
};

export default function ChannelList({ title }: ChannelListProps) {
  const {
    data: channelData,
    isLoading,
    isError,
  } = useQuery<YouTubeChannel[]>({
    queryKey: ['youtube-channels', channelHandleMap[title]],
    queryFn: async () => {
      const handles = channelHandleMap[title] ?? [];
      const results = await Promise.allSettled(
        handles.map((h) => fetch(`/api/mongo/youtube-channel/${h}`).then((res) => res.json()))
      );

      const data = results
        .map((res, i) => (res.status === 'fulfilled' ? { data: res.value, handle: handles[i] } : null))
        .filter(Boolean) as { data: YouTubeChannel; handle: string }[];

      return data.map((c) => ({ ...c.data, handle: c.handle }));
    },
    enabled: !!title,
  });

  if (!channelData || isError || isLoading) return <ChannelListSkeleton />;

  if (channelData.length === 0) {
    return <p className="text-center w-full">추천 채널이 없습니다.</p>;
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {channelData.map((ch) => (
        <li
          key={ch.id}
          className="border-[3px] border-black bg-[#fff8e7] rounded-lg p-6 flex flex-col md:flex-row items-center gap-6"
        >
          <div className="flex flex-col items-center text-center w-full md:w-[100px]">
            <Image
              src={ch.snippet?.thumbnails?.high?.url || '/default-profile.png'}
              alt={ch.snippet?.title || 'Default Channel Profile'}
              width={100}
              height={100}
              className="rounded-full border-2 border-black"
            />
            <h3 className="text-lg font-bold mt-3">{ch.snippet?.title}</h3>
          </div>

          <div className="flex justify-between flex-1 text-center md:text-left">
            <div className="flex items-center flex-col gap-5">
              <p className="text-center text-gray-800 text-sm font-medium leading-relaxed line-clamp-3">
                {ch.snippet?.description || '채널 설명이 없습니다.'}
              </p>
              <p>
                구독자 {ch.statistics?.subscriberCount || '0'}명 · 영상 {ch.statistics?.videoCount || '0'}개
              </p>
            </div>
          </div>
          <Link
            href={`https://www.youtube.com/@${ch.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="md:text-lg text-xs  font-extrabold hover:underline hover:text-blue-800 line-clamp-2"
          >
            채널 방문하기 →
          </Link>
        </li>
      ))}
    </ul>
  );
}
