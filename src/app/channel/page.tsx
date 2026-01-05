'use client';
import { Suspense, useState } from 'react';

import ChannelList from '@/features/channel/components/ChannelList';

const moodTags = ['믹스 채널 추천', 'Jazz 채널 추천', 'Hiphop 채널 추천', 'Rock 채널 추천'];

export default function ChannelPage() {
  const [choicedTag, setChoicedTag] = useState(moodTags[0]);

  const handleTagClick = (tag: string) => {
    setChoicedTag(tag);
  };

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
          <Suspense fallback={<div className="flex items-center justify-center w-[1285px] h-[400px] bg-gray-200 " />}>
            <ChannelList title={choicedTag} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
