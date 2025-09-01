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
    <div key={artist} className="flex flex-col border-b border-black pb-4 last:border-none">
      <h4 className="text-xl font-semibold mb-3 text-gray-900">{artist}</h4>
      <ul className="text-gray-700 text-sm space-y-1">
        {interviews === undefined ? (
          <li className="text-gray-400 italic animate-pulse">로딩 중...</li>
        ) : interviews && interviews.length > 0 ? (
          interviews.slice(0, 5).map((result) => (
            <li key={result.link}>
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:bg-gray-100 transition"
              >
                {result.title}
              </a>
            </li>
          ))
        ) : (
          <li className="text-gray-400 italic">검색 결과 없음</li>
        )}
      </ul>
    </div>
  );
}
