'use client';
import { useQuery } from '@tanstack/react-query';

import { ArtistWiki } from '@/features/tracks/types/WikiArtist';
import getArtistInfo from '@/shared/hooks/getArtistInfo';
import WikiRow from '@/features/tracks/interview/components/WikiRow';

interface Props {
  artistId?: string;
  artistName?: string;
}

export default function ArtistProfileWiki({ artistName }: Props) {
  const {
    data: artistInfo,
    isLoading,
    error,
  } = useQuery<ArtistWiki>({
    queryKey: ['artistInfo', artistName],
    queryFn: () => getArtistInfo(artistName!),
    enabled: !!artistName,
  });

  return (
    <div className="md:px-6 md:py-6 px-3 py-3 w-full mx-auto mt-10  bg-[#fdfbf7] font-serif text-gray-900 leading-relaxed tracking-wide border-4 border-black rounded-md shadow-[5px_5px_0px_#000] min-h-[300px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b-4 border-black pb-2 mb-6">
        <div className="md:px-6 md:py-3 px-2 py-2 md:mb-8 mb-4 text-center w-full flex items-center justify-between bg-[#FFD460] border-y-4 border-black  ">
          <h2 className=" lg:text-2xl md:text-lg text-md font-extrabold uppercase text-black tracking-tight">
            Artist Information
          </h2>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="text-center text-red-600 font-semibold">
          아티스트 정보를 불러오는 데 실패했습니다.
        </div>
      )}

      {/* 테이블 */}
      {(isLoading || artistInfo) && (
        <table className="w-full table-fixed border-collapse">
          <tbody>
            <WikiRow label="본명" value={artistInfo?.artistName} isLoading={isLoading} />
            <WikiRow label="생년월일" value={artistInfo?.birthDate?.time} isLoading={isLoading} />
            <WikiRow label="성별" value={artistInfo?.gender} isLoading={isLoading} />
            <WikiRow label="국적" value={artistInfo?.nationality} isLoading={isLoading} />
            <WikiRow label="장르" value={artistInfo?.genres?.join(', ')} isLoading={isLoading} />
            <WikiRow
              label="수상내역"
              value={
                artistInfo?.awards && artistInfo.awards.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 marker:text-black">
                    {artistInfo.awards.map((award, idx) => (
                      <li key={idx} className="text-sm">
                        {award}
                      </li>
                    ))}
                  </ul>
                ) : (
                  '정보 없음'
                )
              }
              isLoading={isLoading}
            />
          </tbody>
        </table>
      )}
    </div>
  );
}
