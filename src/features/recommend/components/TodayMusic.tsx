'use client';

import { useRef, useState, Suspense } from 'react';

import RecommandList from '@/features/recommend/components/RecommendList';
import useUserStore from '@/stores/userStore';

export default function TodayMusic() {
  const moodTagRef = useRef<HTMLDivElement>(null);
  const [choicedTag, setChoicedTag] = useState<string>('Chill');
  const { user } = useUserStore();
  const isLoggedIn = !!user;

  const moodTags = ['Chill', 'HipHop', 'Jazz', 'Pop', 'KPop', 'Rock', 'Classical'];

  const handleTagClick = (tag: string) => {
    setChoicedTag(tag);
  };
  return (
    <section className="w-fit py-12 px-6">
      <div className="text-center mb-10">
        {!isLoggedIn ? (
          <div className="flex flex-row items-center justify-center lg:text-[56px] text-[40px] font-extrabold leading-tight">
            <h1 className=" text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
              Hello,
            </h1>
            <span className="text-[#d43c3c]">Guest!</span>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center lg:text-[56px] text-[40px] font-extrabold leading-tight">
            <h1 className=" text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
              Hello,
            </h1>
            <span className="text-[#d43c3c]">{user?.displayName}!</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between bg-[#FFD460] border-y-4 border-black px-6 py-3 mb-6">
        <span className="lg:text-3xl md:text-xl text-lg font-extrabold uppercase">
          오늘은 이 음악 어때요?
        </span>
      </div>

      <div ref={moodTagRef} className="flex  justify-between pb-4">
        {moodTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={` py-3 md:px-[0px] px-2  lg:w-[120px] md:w-[100px]  lg:text-lg md:text-md cursor-pointer font-bold uppercase  border-2 border-black shadow-[4px_4px_0px_#000] transition-all
              ${
                choicedTag === tag
                  ? 'bg-[#d43c3c] text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-12 min-h-screen border-4 border-black bg-white shadow-[8px_8px_0px_#000] p-8">
        <h3 className="lg:text-2xl md:text-xl text-lg font-extrabold uppercase border-b-2 border-black pb-2 mb-6">
          Recommended Playlists
        </h3>

        <div style={{ maxWidth: 1400, minHeight: 4000, position: 'relative' }}>
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-[400px] bg-gray-200 " />
            }
          >
            <RecommandList tag={choicedTag} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
