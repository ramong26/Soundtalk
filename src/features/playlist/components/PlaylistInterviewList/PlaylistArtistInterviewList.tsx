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
      className=" w-[1272px] mx-auto flex flex-col border-b-2 border-black pb-6 last:border-none"
    >
      {/* 아티스트 이름 */}
      <div className="flex items-center justify-between bg-[#FFD460] border-y-4 border-black px-6 py-2 mb-6">
        <span className="lg:text-2xl md:text-xl text-lg font-extrabold uppercase">{artist}</span>
      </div>
      {/* 검색 결과 리스트 */}
      <ul className="flex items-center justify-between gap-4 text-sm md:text-base">
        {interviews === undefined ? (
          <li className="text-gray-400 italic animate-pulse col-span-2">로딩 중...</li>
        ) : interviews && interviews.length > 0 ? (
          interviews.slice(0, 4).map((result) => (
            <li
              key={result.link}
              className="w-[300px] h-[258px] border-4 border-black bg-white shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000] transition-all duration-200 cursor-pointer flex flex-col"
            >
              <Image
                src={result.pagemap?.metatags?.[0]['og:image'] || '/placeholder-image.png'}
                alt={result.title ?? '인터뷰 이미지'}
                width={100}
                height={100}
                className="w-full h-[142px] mb-2 "
              />
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-extrabold px-3 pb-3 pt-1 hover:underline hover:text-blue-500 "
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

// import { CustomSearchResult } from '@/features/tracks/types/custom-search';

// interface ArtistInterviewListProps {
//   artist: string;
//   interviews: CustomSearchResult[] | null | undefined;
// }

// export default function PlaylistArtistInterviewList({
//   artist,
//   interviews,
// }: ArtistInterviewListProps) {
//   return (
//     <div key={artist} className="flex flex-col border-b-2 border-black pb-6 last:border-none">
//       {/* 아티스트 이름 */}
//       <h4 className="text-lg md:text-xl font-extrabold mb-3 text-black tracking-wide bg-yellow-300 px-3 py-1 inline-block border-2 border-black rounded-md">
//         {artist}
//       </h4>

//       {/* 검색 결과 리스트 */}
//       <ul className="text-sm md:text-base space-y-2">
//         {interviews === undefined ? (
//           <li className="text-gray-400 italic animate-pulse">로딩 중...</li>
//         ) : interviews && interviews.length > 0 ? (
//           interviews.slice(0, 5).map((result) => (
//             <li key={result.link}>
//               <a
//                 href={result.link}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="block bg-pink-200 border-2 border-black px-3 py-2 rounded-lg font-medium hover:bg-pink-400 transition"
//               >
//                 {result.title}
//               </a>
//             </li>
//           ))
//         ) : (
//           <li className="text-gray-400 italic">검색 결과 없음</li>
//         )}
//       </ul>
//     </div>
//   );
// }
