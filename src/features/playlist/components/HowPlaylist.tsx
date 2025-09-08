import Image from 'next/image';

import HowPlaylist1 from '@/public/image/how-playlist1.png';
import HowPlaylist2 from '@/public/image/how-playlist2.png';

export default function HowPlaylist() {
  return (
    <section className=" mt-12 p-4 lg:p-8 md:p-6 bg-[#fdfbf7] border-4 border-black shadow-[6px_6px_0px_#000] flex flex-col items-center">
      <h1 className="text-center lg:text-5xl md:text-4xl text-3xl font-extrabold leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460] underline mb-8">
        How to Submit Playlist
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 w-full max-w-[1286px]">
        {/* 플레이 방법 1 */}
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 text-lg md:text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">①</span> 공개 상태 확인
          </span>
          <div className="relative w-full max-w-[550px] h-[220px] md:h-[300px] border-4 border-black bg-white rounded-xl overflow-hidden shadow-[4px_4px_0px_black]">
            <Image
              src={HowPlaylist1}
              alt="공개 플레이리스트 확인"
              fill
              className="object-contain p-3"
              priority
              sizes="(max-width: 768px) 100vw, 550px"
            />
          </div>
          <p className="mt-4 text-sm md:text-base font-semibold">
            플레이리스트를 공개 상태로 두어야 제출 가능!
          </p>
        </div>
        {/* 플레이 방법 2 */}
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 text-lg md:text-xl font-bold flex items-center gap-2">
            <span className="text-2xl">②</span> 링크 복사 & 제출
          </span>
          <div className="relative w-full max-w-[550px] h-[220px] md:h-[300px] border-4 border-black bg-white rounded-xl overflow-hidden shadow-[4px_4px_0px_black]">
            <Image
              src={HowPlaylist2}
              alt="플레이리스트 링크 복사"
              fill
              className="object-contain p-3"
              priority
              sizes="(max-width: 768px) 100vw, 550px"
            />
          </div>
          <p className="mt-4 text-sm md:text-base font-semibold">
            공식 스포티파이 플레이리스트는 제출 불가!!🙅
          </p>
        </div>
      </div>
    </section>
  );
}
