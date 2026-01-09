import { getBaseUrl } from '@/lib/utils/baseUrl';
import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';

import TrackClient from '@/features/tracks/components/TrackClient';

export const metadata = {
  title: 'Track Page',
  description: 'Details about the track',
};

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}
export default async function TrackPage({ params }: PageProps) {
  const baseUrl = getBaseUrl();
  const { id } = await params;

  console.log('[TrackPage SERVER] Rendering track:', id);

  if (!baseUrl) {
    return <div className="text-center mt-10 text-red-500">Configuration error: BASE_URL is not set</div>;
  }

  try {
    const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
      cache: 'no-store',
    });

    console.log('[TrackPage SERVER] Fetch result:', res.status);

    if (!res.ok) {
      console.error('[TrackPage SERVER] Fetch failed:', res.status);
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold mb-4">트랙 정보를 불러올 수 없습니다</h2>
          <p>Status: {res.status}</p>
        </div>
      );
    }

    const { track, album } = await res.json();

    console.log('[TrackPage SERVER] Got data:', { hasTrack: !!track, hasAlbum: !!album });

    if (!track || !album) {
      return <div className="text-center mt-10 text-red-500">트랙 또는 앨범 정보가 없습니다</div>;
    }

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <div className="text-2xl font-bold text-blue-500 mb-4"> 서버 렌더링 성공! Track: {track.name}</div>
        <TrackDescription album={album} />
        <div className="text-2xl font-bold text-green-500 mb-4">TrackDescription 렌더링 완료</div>
        <TrackClient trackId={id} album={album} />
      </div>
    );
  } catch (error) {
    console.error('[TrackPage SERVER] Error:', error);
    return (
      <div className="text-center mt-10 text-red-500">
        <h2 className="text-2xl font-bold mb-4">예상치 못한 오류가 발생했습니다</h2>
        <p>{String(error)}</p>
      </div>
    );
  }
}
