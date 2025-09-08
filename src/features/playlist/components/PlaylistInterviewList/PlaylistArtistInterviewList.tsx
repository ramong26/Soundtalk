import Image from 'next/image';

import { CustomSearchResult } from '@/features/tracks/types/custom-search';

interface ArtistInterviewListProps {
  artist: string;
  interviews: CustomSearchResult[] | null | undefined;
}

export default function PlaylistArtistInterviewList({
  artist,
  interviews,
}: ArtistInterviewListProps) {
  return (
    <div
      key={artist}
      className="w-full max-w-[1280px] mx-auto flex flex-col border-b-2 border-black pb-6 last:border-none"
    >
      {/* 아티스트 이름 */}
      <div className="flex items-center justify-between bg-[#FFD460] border-y-4 border-black px-4 md:px-6 py-2 mb-6">
        <span className="lg:text-2xl md:text-xl text-lg font-extrabold uppercase">{artist}</span>
      </div>
      {/* 검색 결과 리스트 */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm md:text-base">
        {interviews === undefined ? (
          <li className="text-gray-400 italic animate-pulse col-span-2">로딩 중...</li>
        ) : interviews && interviews.length > 0 ? (
          interviews.slice(0, 4).map((result) => (
            <li
              key={result.link}
              className="w-full max-w-[300px] h-auto border-4 border-black bg-white shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000] transition-all duration-200 cursor-pointer flex flex-col"
            >
              <div className="relative w-full aspect-[2/1] rounded-t">
                <Image
                  src={result.pagemap?.metatags?.[0]['og:image'] || '/placeholder-image.png'}
                  alt={result.title ?? '인터뷰 이미지'}
                  fill
                  className="object-cover rounded-t"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base md:text-lg font-extrabold px-3 pb-3 pt-2 hover:underline hover:text-blue-800 line-clamp-2"
              >
                {result.title}
              </a>
            </li>
          ))
        ) : (
          <li className="text-gray-400 italic col-span-2">검색 결과 없음</li>
        )}
      </ul>
    </div>
  );
}
