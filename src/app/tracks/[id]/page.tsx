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
  const { id } = await params;
  const baseUrl = getBaseUrl();

  console.log('[TrackPage] id:', id, 'baseUrl:', baseUrl);

  // baseUrl 체크를 먼저!
  if (!baseUrl) {
    console.error('[TrackPage] BASE_URL is not set');
    return <div className="text-center mt-10 text-red-500">Configuration error: BASE_URL is not set</div>;
  }

  try {
    const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
      cache: 'no-store',
    });

    console.log('[TrackPage] fetch response status:', res.status);

    // res.ok 체크 추가
    if (!res.ok) {
      console.error('[TrackPage] fetch failed:', res.status, res.statusText);
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold mb-4">트랙 정보를 불러올 수 없습니다</h2>
          <p>Status: {res.status}</p>
        </div>
      );
    }

    const { track, album } = await res.json();

    if (!track || !album) {
      console.error('[TrackPage] track or album is missing');
      return null;
    }

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <TrackDescription album={album} />
        <TrackClient trackId={id} album={album} />
      </div>
    );
  } catch (error) {
    console.error('[TrackPage] Unexpected error:', error);
    return <div className="text-center mt-10 text-red-500">예상치 못한 오류가 발생했습니다</div>;
  }
}
