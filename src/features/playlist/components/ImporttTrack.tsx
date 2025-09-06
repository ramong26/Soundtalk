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
        className={`md:px-3 px-2 flex flex-col items-center gap-4 cursor-pointer  hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
          (index + 1) % 5 !== 0 ? 'border-r-2 border-dashed border-black/50' : ''
        }`}
      >
        <div className="relative">
          <div className="md:w-[150px] w-[100px] md:h-[150px] h-[100px] rounded-lg border-4 border-black shadow-[5px_5px_0px_#D65361] hover:scale-105 transition-transform" />
        </div>
        <div className="flex flex-col items-center text-black gap-1 text-center">
          <div className="md:text-base text-sm md:max-w-[140px] max-w-[100px] font-bold truncate uppercase"></div>
          <div className="lg:text-lg md:text-md text-xs md:max-w-[140px] max-w-[100px] text-gray-700 truncate  italic"></div>
        </div>
      </div>
    ));
  };

  // 실제 트랙 아이템 렌더링
  const renderTrackItems = () => {
    return tracksList?.map((item, index) => {
      const key = item.track.id + index;
      return link ? (
        <Link href={`/tracks/${item.track.id}`} key={key}>
          <div
            className={`w-[150px] md:pr-5 px-2 flex flex-col items-center gap-4 cursor-pointer hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
              tracksList.length - 1 === index ? '' : 'border-r-2 border-dashed border-black/50'
            }`}
          >
            <div className="relative">
              <Image
                src={item.track.album.images[0].url}
                alt={item.track.name}
                width={120}
                height={120}
                className="md:w-[120px] w-[100px] md:h-[120px] h-[100px] rounded-lg border-4 border-black shadow-[5px_5px_0px_#D65361] hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col items-center text-black gap-1 text-center">
              <div className="md:text-base text-sm md:max-w-[140px] max-w-[100px] font-bold truncate uppercase">
                {item.track.name}
              </div>
              <div className="lg:text-lg md:text-md text-xs md:max-w-[140px] max-w-[100px] text-gray-700 truncate italic">
                {item.track.artists.map((artist) => artist.name).join(', ')}
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <div
          key={key}
          className="flex items-center gap-4 mb-4 border-b-1 border-black pb-4 transition w-full h-[70px]"
        >
          <div className="flex items-center gap-4">
            <Image
              src={item.track.album.images[0].url}
              alt={item.track.name}
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-col overflow-hidden w-full">
            <div className="font-bold text-lg break-words w-full whitespace-nowrap text-ellipsis">
              {item.track.name}
            </div>
            <div className="max-w-md text-gray-600 break-words">
              {item.track.artists.map((artist) => artist.name).join(', ')}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div
      className={`relative border-2 border-black py-6 mt-12 bg-white rounded-xl shadow-md ${className}`}
    >
      <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-1 rounded-md border-2 border-black font-bold text-xl">
        트랙 미리보기
      </span>

      <div className="h-[230px] pl-3 flex flex-row flex-nowrap items-center gap-4 mt-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {isLoading ? renderSkeletonItems() : renderTrackItems()}
      </div>
    </div>
  );
}
