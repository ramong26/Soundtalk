'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import SubmitInput from '@/shared/components/SubmitInput';
import { useTrackList, useAllTracks } from '@/shared/hooks/getTrackList';
import { usePlaylistSubmit } from '@/features/playlist/hooks/SubmitPlaylist/usePlaylistSubmit';

const ImportTrack = dynamic(() => import('@/features/playlist/components/ImporttTrack'), {
  ssr: false,
});

const PlaylistInterviewList = dynamic(
  () => import('@/features/playlist/components/PlaylistInterviewList/PlaylistInterviewList'),
  { ssr: false }
);

export default function SubmitPlaylist() {
  const { submitUrl, setSubmitUrl, playlistId, showChart, handleSubmit, error } =
    usePlaylistSubmit();

  const { data: pageTracks, isLoading } = useTrackList(playlistId);
  const { data: allTracks = [] } = useAllTracks(playlistId);

  const topTracks = useMemo(() => allTracks.slice(0, 100), [allTracks]);

  const isValidData = Array.isArray(pageTracks) && pageTracks.length > 0;

  return (
    <section className="w-full max-w-[1280px] mx-auto mt-12 min-h-[30vh] flex flex-col items-center mb-10">
      <h1 className="flex items-center justify-center mb-5 text-center lg:text-5xl md:text-4xl text-3xl font-extrabold leading-tight text-black uppercase tracking-wide drop-shadow-[3px_3px_0px_#FFD460]">
        Submit Your Playlist !
      </h1>

      {/* 입력 박스 */}
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full  bg-white border-2 border-black p-4 md:p-8 rounded-xl shadow-md flex flex-col gap-4">
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

        {/* 트랙 카드 리스트 */}
        {showChart && (
          <div className="mt-10 w-full flex flex-col items-center">
            {isLoading && <ImportTrack isLoading />}
            {error && <p className="text-red-600 text-center font-bold">❌ 오류 발생: {error}</p>}

            {isValidData && (
              <div className="w-full ">
                <ImportTrack link tracksList={pageTracks} />
              </div>
            )}

            {!isValidData && !isLoading && !error && (
              <p className="text-center text-gray-700 font-semibold">
                트랙을 표시할 수 없습니다 😢 <br />
                플레이리스트가 비어있거나 올바른 링크인지 확인해주세요.
              </p>
            )}

            {/* 아티스트 인터뷰 리스트 */}
            <div className="w-full mt-8">
              <PlaylistInterviewList key={playlistId} trackData={topTracks} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
