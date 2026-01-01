'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import SubmitInput from '@/shared/components/SubmitInput';

import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';
import { TrackItem } from '@/shared/types/spotifyTrack';
import { useFetchArtistInterviews } from '../hooks/PlaylistInterviewList/useFetchArtistInterviews';
import { useQuery } from '@tanstack/react-query';

const ImportTrack = dynamic(() => import('@/features/playlist/components/ImportTrack'), {
  ssr: false,
});

export default function SubmitPlaylist() {
  const [submitUrl, setSubmitUrl] = useState('');
  const [playlistId, setPlaylistId] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractPlaylistId = (url: string): string => {
    if (url.startsWith('https://open.spotify.com/playlist/')) {
      const regex = /(?:playlist[\/:])([a-zA-Z0-9]+)/;
      const match = url.match(regex);
      return match ? match[1] : '';
    }
    return '';
  };

  // 플레이리스트 ID를 제출하는 함수
  const handleSubmit = (input: string) => {
    const id = extractPlaylistId(input.trim());

    if (input.trim() === '') {
      setError('플레이리스트 ID가 비어있어요!');
      setShowChart(false);
      return;
    }
    if (!id) {
      setError('유효한 플레이리스트 ID를 입력해주세요!');
      setShowChart(false);
      return;
    }
    setPlaylistId(id.trim());
    setShowChart(true);
    setError(null);
  };

  const {
    data: pageTracks,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery<TrackItem[]>({
    queryKey: ['track-list', playlistId, 0, 100],
    queryFn: () => getTopTrackPlaylist({ playlistId, offset: 0, limit: 100 }),
    enabled: !!playlistId,
    staleTime: 1000 * 60 * 60,
  });

  // TODO: useFetchArtistInterviews 리펙토링 및 이쪽으로 이동 필요
  const { artistInterviews, observerRef, isScrollLoading, artists, chunkSize, visibleChunks } =
    useFetchArtistInterviews({ trackData: pageTracks });

  return (
    <section className="w-full max-w-[1280px] mx-auto mt-12 min-h-[30vh] flex flex-col items-center mb-10">
      <h1 className="mb-5 text-center lg:text-5xl md:text-4xl text-3xl font-extrabold leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
        Submit Your Playlist !
      </h1>

      {/* 입력 박스 */}
      <div className="w-full flex flex-col items-center">
        <div className="w-full bg-white border-2 border-black p-4 md:p-8 rounded-xl shadow-md flex flex-col gap-4">
          <SubmitInput
            placeholder="Spotify 플레이리스트 링크를 넣어주세요!"
            value={submitUrl}
            onChange={(e) => setSubmitUrl(e.target.value)}
            onSubmit={() => handleSubmit(submitUrl)}
          />
          <p className="text-xs md:text-sm text-gray-700 font-medium text-center">
            🔑 공개된 플레이리스트만 제출 가능 / 📎 Spotify 공식 리스트는 불가
          </p>
        </div>

        {isError && (
          <p className="text-red-600 text-center font-bold">
            ❌ 플레이리스트를 불러오는 중 오류가 발생했습니다:{' '}
            {fetchError instanceof Error ? fetchError.message : '알 수 없는 오류'}
          </p>
        )}
        {showChart && (
          <div className="mt-10 w-full flex flex-col items-center">
            {isLoading && <ImportTrack isLoading />}
            {error && <p className="text-red-600 text-center font-bold">❌ 오류 발생: {error}</p>}

            {pageTracks && <ImportTrack tracksList={pageTracks} link />}

            {!pageTracks && !isLoading && !error && (
              <p className="text-center text-gray-700 font-semibold">
                트랙을 표시할 수 없습니다 😢 <br />
                플레이리스트가 비어있거나 올바른 링크인지 확인해주세요.
              </p>
            )}

            <div className="w-full mt-8">
              <div className="pb-16 mt-12 w-full flex flex-col gap-8">
                {artists.slice(0, visibleChunks * chunkSize).map((artist) => (
                  <div
                    key={artist}
                    className="w-full max-w-[1280px] mx-auto flex flex-col border-b-2 border-black pb-6 last:border-none"
                  >
                    <div className="flex items-center justify-between bg-[#FFD460] border-y-4 border-black px-4 md:px-6 py-2 mb-6">
                      <span className="lg:text-2xl md:text-xl text-lg font-extrabold uppercase">{artist}</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm md:text-base">
                      {artistInterviews[artist] === undefined ? (
                        <li className="text-gray-400 italic animate-pulse col-span-2">로딩 중...</li>
                      ) : artistInterviews[artist] && artistInterviews[artist].length > 0 ? (
                        artistInterviews[artist].slice(0, 4).map((result) => (
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
                ))}
                {isScrollLoading && <div className="text-center text-gray-500">로딩 중...</div>}
                {visibleChunks * chunkSize < artists.length && <div ref={observerRef} className="h-10" />}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
