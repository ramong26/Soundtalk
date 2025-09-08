import Image from 'next/image';
import Link from 'next/link';

import { TrackItem } from '@/shared/types/spotifyTrack';

interface ImportTrackProps {
  tracksList?: TrackItem[];
  className?: string;
  isLoading?: boolean;
  link?: boolean;
}

export default function ImportTrack({ tracksList, className, isLoading, link }: ImportTrackProps) {
  const skeletonCount = tracksList?.length ?? 10;

  const renderSkeletonItems = () => {
    return Array.from({ length: skeletonCount }, (_, index) => (
      <div
        key={`skeleton-${index}`}
        className={`md:px-3 px-1 flex flex-col items-center gap-3 md:gap-4 cursor-pointer hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
          (index + 1) % 5 !== 0 ? 'border-r-2 border-dashed border-black/30' : ''
        }`}
        style={{ minWidth: '90px', maxWidth: '150px', width: '100%' }}
      >
        <div className="relative">
          <div className="md:w-[120px] w-[80px] md:h-[120px] h-[80px] rounded-lg border-4 border-black shadow-[3px_3px_0px_#D65361] bg-gray-100" />
        </div>
        <div className="flex flex-col items-center text-black gap-1 text-center">
          <div className="md:text-base text-xs md:max-w-[110px] max-w-[80px] font-bold truncate uppercase"></div>
          <div className="lg:text-lg md:text-sm text-xs md:max-w-[110px] max-w-[80px] text-gray-700 truncate italic"></div>
        </div>
      </div>
    ));
  };

  const renderTrackItems = () => {
    return tracksList?.map((item, index) => {
      const key = item.track.id + index;
      return link ? (
        <Link href={`/tracks/${item.track.id}`} key={key}>
          <div
            className={`md:px-3 px-1 flex flex-col items-center gap-3 md:gap-4 cursor-pointer hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
              tracksList.length - 1 === index ? '' : 'border-r-2 border-dashed border-black/30'
            }`}
            style={{ minWidth: '90px', maxWidth: '150px', width: '100%' }}
          >
            <div className="relative">
              <Image
                src={item.track.album.images[0].url}
                alt={item.track.name}
                width={120}
                height={120}
                className="md:w-[110px] w-[80px] md:h-[110px] h-[80px] rounded-lg border-4 border-black shadow-[3px_3px_0px_#D65361] object-cover"
                sizes="(max-width: 640px) 80px, 110px"
              />
            </div>
            <div className="flex flex-col items-center text-black gap-1 text-center w-full">
              <div className="md:text-base text-xs md:max-w-[110px] max-w-[80px] font-bold truncate uppercase">
                {item.track.name}
              </div>
              <div className="lg:text-lg md:text-sm text-xs md:max-w-[110px] max-w-[80px] text-gray-700 truncate italic">
                {item.track.artists.map((artist) => artist.name).join(', ')}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div
          key={key}
          className="flex items-center gap-3 md:gap-4 mb-4 border-b border-black/20 pb-3 transition w-full h-[70px]"
        >
          <div className="flex items-center gap-2">
            <Image
              src={item.track.album.images[0].url}
              alt={item.track.name}
              width={50}
              height={50}
              className="rounded-lg object-cover"
              sizes="50px"
            />
          </div>
          <div className="flex flex-col overflow-hidden w-full">
            <div className="font-bold text-base md:text-lg break-words w-full whitespace-nowrap text-ellipsis">
              {item.track.name}
            </div>
            <div className="max-w-md text-xs md:text-sm text-gray-600 break-words">
              {item.track.artists.map((artist) => artist.name).join(', ')}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <section
      className={`relative border-2 border-black py-4 md:py-6 mt-8 bg-white shadow-md ${className}`}
    >
      <div className="relative top-[-20px] lg:text-2xl md:text-xl text-base font-extrabold md:px-[30px] px-[10px] h-[54px] flex items-center text-black bg-[#FFD460] border-t-4 border-b-4 border-black justify-between shadow-[0_4px_0_#000] uppercase tracking-wide">
        <div>🔥 트랙 미리보기</div>
      </div>

      {/* 자동 스크롤 + 수동 스크롤  */}
      <div className="relative w-full pt-[10px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
        <div className="flex gap-3 md:gap-6 animate-scroll">
          {isLoading ? renderSkeletonItems() : renderTrackItems()}
          {/* 무한 반복 효과 위해 한 번 더 (원하면 제거 가능) */}
          {isLoading ? renderSkeletonItems() : renderTrackItems()}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-40%);
          }
        }
        .animate-scroll {
          width: max-content;
          display: flex;
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
