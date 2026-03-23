import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';
import { ChartItemProps } from './types';

const ChartItem = ({ track, index }: ChartItemProps) => {
  return (
    <Link href={`/tracks/${track?.track?.id}`} className="w-1/5">
      <div
        className={`md:px-3 px-2 flex flex-col items-center gap-4 cursor-pointer  hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
          index !== 4 ? 'border-r-2 border-dashed border-black/50' : ''
        }`}
      >
        <div className="relative">
          <Image
            src={track?.track?.album?.images?.[1]?.url || track?.track?.album?.images?.[0]?.url}
            alt={track?.track?.name}
            width={150}
            height={150}
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 150px"
            className=" w-[50px] h-[50px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] max-w-full max-h-full rounded-lg border-4 border-black shadow-[5px_5px_0px_#D65361] hover:scale-105 transition-transform"
          />
          <div className=" lg:h-8 h-6 lg:w-8 w-6  absolute -top-3 -left-3 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_#FFD460]">
            {index + 1}
          </div>
        </div>
        <div className="flex flex-col items-center text-black gap-1 text-center">
          <div className="text-xs sm:text-sm md:text-base lg:text-lg max-w-[60px] sm:max-w-[60px] md:max-w-[140px] lg:max-w-[180px] font-bold truncate uppercase">
            {track?.track?.name}
          </div>

          <div className=" text-xs sm:text-sm md:text-md lg:text-lg max-w-[60px] sm:max-w-[60px] md:max-w-[140px] lg:max-w-[180px] text-gray-700 truncate italic">
            {track?.track?.artists?.map((artist) => artist.name).join(', ')}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default memo(ChartItem);
