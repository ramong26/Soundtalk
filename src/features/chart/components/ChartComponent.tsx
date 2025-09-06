import Image from 'next/image';
import Link from 'next/link';

import { TrackItem } from '@/shared/types/spotifyTrack';

interface ChartComponentProps {
  tracksList: TrackItem[];
  title: string;
  className?: string;
}

export default function ChartComponent({ tracksList, title, className = '' }: ChartComponentProps) {
  return (
    <div
      className={`relative lg:p-8 md:p-6 p-4 border-4 border-black bg-[#fdfbf7] shadow-[6px_6px_0px_#000000]  mt-20 w-full max-w-[572px] ${className}
      `}
    >
      <h2 className="font-extrabold lg:text-2xl md:text-xl text-lg absolute -top-7 left-1/2 -translate-x-1/2 bg-[#FFD460] text-black px-8 py-2 border-3 border-black  uppercase flex items-center gap-2">
        {title}
      </h2>
      <div className="flex flex-col gap-6 mt-4">
        {tracksList.map((item, index) => (
          <Link
            key={item.track.id}
            href={`/tracks/${item.track.id}`}
            className={`flex items-center gap-6 mb-2 p-4 bg-white border-3 border-black shadow-[4px_4px_0px_#000] cursor-pointer transition-transform hover:-translate-y-1 hover:scale-[1.03] last:border-b-0`}
          >
            <div className="relative flex items-center">
              <div className="absolute -top-3 -left-3 bg-black text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold shadow-[2px_2px_0px_#FFD460]">
                {index + 1}
              </div>
              <Image
                src={item.track.album.images[0].url}
                alt={item.track.name}
                width={100}
                height={100}
                className="rounded-lg border-3 border-black shadow-[4px_4px_0px_#D65361] bg-white"
              />
            </div>
            <div className="lg:w-[300px] w-[200px] lg:h-[100px] h-[70px] flex flex-col justify-center overflow-hidden  text-black">
              <div className="font-bold text-lg break-words max-w-xs uppercase truncate">
                {item.track.name}
              </div>
              <div className="text-md text-gray-700 italic break-words max-w-xs truncate">
                {item.track.artists.map((artist) => artist.name).join(', ')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
