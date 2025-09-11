'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { YouTubeChannel } from '@/shared/types/youtube';

import ChannelListSkeleton from '@/features/channel/components/ChannelListSkeleton';

// 채널 핸들 매핑
const channelHandleMap: Record<string, string[]> = {
  '믹스 채널 추천': ['RAPHAEL_MIXES', 'retapestudios', 'HumanoStudios'],
  'Jazz 채널 추천': ['ICYFOG', 'midnightradio2', 'RetroCafeRadio'],
  'Hiphop 채널 추천': ['peddlermusic'],
  'Rock 채널 추천': ['On8ight'],
};

export default function ChannelList({ title }: { title: string }) {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);

  // title이 바뀔 때마다 채널 정보 불러오기 mongoDB API 사용
  useEffect(() => {
    if (!title) return;

    const controller = new AbortController();

    const fetchChannels = async () => {
      const handles = channelHandleMap[title] ?? [];
      const results = await Promise.allSettled(
        handles.map((h) =>
          fetch(`/api/mongo/youtube-channel/${h}`, { signal: controller.signal }).then((res) =>
            res.json()
          )
        )
      );

      if (controller.signal.aborted) return;

      const data = results
        .map((res, i) =>
          res.status === 'fulfilled' ? { data: res.value, handle: handles[i] } : null
        )
        .filter(Boolean) as { data: YouTubeChannel; handle: string }[];

      setChannels(data.map((c) => ({ ...c.data, handle: c.handle })));
    };

    fetchChannels();

    // 컴포넌트 언마운트 시 fetch 취소
    return () => {
      controller.abort();
    };
  }, [title]);

  if (!channels.length) return <ChannelListSkeleton />;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {channels.map((ch) => (
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
                구독자 {ch.statistics?.subscriberCount || '0'}명 · 영상{' '}
                {ch.statistics?.videoCount || '0'}개
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
