'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import ChannelListSkeleton from '@/features/channel/components/ChannelList/ChannelListSkeleton';

import { ChannelMapping } from './types';
import { YouTubeChannel } from '@/shared/types/youtube';

const channelHandleMap: ChannelMapping = {
  '믹스 채널 추천': ['RAPHAEL_MIXES', 'retapestudios', 'HumanoStudios'],
  'Jazz 채널 추천': ['ICYFOG', 'midnightradio2', 'RetroCafeRadio'],
  'Hiphop 채널 추천': ['peddlermusic'],
  'Rock 채널 추천': ['On8ight'],
};

const moodTags = ['믹스 채널 추천', 'Jazz 채널 추천', 'Hiphop 채널 추천', 'Rock 채널 추천'];

export default function ChannelList() {
  const [choicedTag, setChoicedTag] = useState(moodTags[0]);

  const handleTagClick = (tag: string) => {
    setChoicedTag(tag);
  };

  const {
    data: channelData,
    isLoading,
    isError,
  } = useQuery<YouTubeChannel[]>({
    queryKey: ['youtube-channels', channelHandleMap[choicedTag]],
    queryFn: async ({ signal }) => {
      const handles = channelHandleMap[choicedTag] ?? [];
      const results = await Promise.allSettled(
        handles.map((h) => fetch(`/api/mongo/youtube-channel/${h}`, { signal }).then((res) => res.json()))
      );

      const data = results
        .map((res, i) => (res.status === 'fulfilled' ? { data: res.value, handle: handles[i] } : null))
        .filter(Boolean) as { data: YouTubeChannel; handle: string }[];
      return data.map((c) => ({ ...c.data, handle: c.handle }));
    },

    enabled: !!choicedTag,
  });

  if (!channelData || isLoading) return <ChannelListSkeleton />;

  if (channelData.length === 0 || isError) {
    return <p className="text-center w-full">추천 채널이 없습니다.</p>;
  }

  return (
    <section className=" py-12 px-6 w-full max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
      {/* 상단 타이틀 */}
      <div className="text-center mb-10">
        <div className="flex flex-row items-center justify-center lg:text-[56px] text-[40px] font-extrabold leading-tight">
          <h1 className=" text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">Recommend for you!</h1>
        </div>
      </div>

      {/* 배너 */}
      <div className="flex items-center justify-between bg-[#FFD460] border-y-4 border-black px-6 py-3 mb-6">
        <span className="lg:text-3xl md:text-xl text-lg font-extrabold uppercase">오늘은 이 채널 어때요?</span>
      </div>

      {/* 태그 버튼 */}
      <div className="flex flex-wrap gap-2 justify-between pb-4">
        {moodTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`py-3 px-2 lg:w-[190px] md:w-[130px] w-[100px] text-sm md:text-md lg:text-lg cursor-pointer font-bold uppercase border-2 border-black shadow-[4px_4px_0px_#000] transition-all
                  ${choicedTag === tag ? 'bg-[#d43c3c] text-white' : 'bg-white text-black hover:bg-gray-100'}`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 카드 리스트 영역 */}
      <div className="mt-12 border-4 border-black bg-white shadow-[8px_8px_0px_#000] p-8">
        <h3 className="lg:text-2xl md:text-xl text-lg font-extrabold uppercase border-b-2 border-black pb-2 mb-6">
          Recommended Channels
        </h3>

        <div className="max-w-[2000px] relative">
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
        </div>
      </div>
    </section>
  );
}
