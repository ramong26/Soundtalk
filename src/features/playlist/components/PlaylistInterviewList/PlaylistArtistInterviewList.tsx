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
  console.log('interviews', interviews);
  return (
    <div key={artist} className="flex flex-col border-b-2 border-black pb-6 last:border-none">
      {/* 아티스트 이름 */}
      <h4 className="text-lg md:text-xl font-extrabold mb-3 text-black tracking-wide bg-yellow-300 px-3 py-1 inline-block border-2 border-black rounded-md">
        {artist}
      </h4>

      {/* 검색 결과 리스트 */}
      <ul className="grid grid-cols-2 gap-4 text-sm md:text-base">
        {interviews === undefined ? (
          <li className="text-gray-400 italic animate-pulse col-span-2">로딩 중...</li>
        ) : interviews && interviews.length > 0 ? (
          interviews.slice(0, 4).map((result) => (
            <li key={result.link} className="flex flex-col items-start">
              <Image
                src={result.pagemap?.metatags?.[0]['og:image'] || '/placeholder-image.png'}
                alt={result.title ?? '인터뷰 이미지'}
                width={100}
                height={100}
                className="w-[253px] h-[142px] mb-2 rounded-md"
              />
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-pink-200 border-2 border-black px-3 py-2 rounded-lg font-medium hover:bg-pink-400 transition"
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
