import { getBaseUrl } from '@/lib/utils/baseUrl';
import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';

// import TrackClient from '@/features/tracks/components/TrackClient';

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

  if (!baseUrl) {
    return <div className="text-center mt-10 text-red-500">Configuration error: BASE_URL is not set</div>;
  }

  try {
    const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold mb-4">트랙 정보를 불러올 수 없습니다</h2>
        </div>
      );
    }

    const { track, album } = await res.json();

    if (!track || !album) {
      return <div className="text-center mt-10 text-red-500">트랙 또는 앨범 정보가 없습니다</div>;
    }

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <TrackDescription album={album} />
        <div className="text-2xl font-bold text-green-500">여기까지는 렌더링됨!</div>
        {/* 임시로 주석 처리 */}
        {/* <TrackClient trackId={id} album={album} /> */}
      </div>
    );
  } catch (error) {
    console.error('[TrackPage] Error:', error);
    return (
      <div className="text-center mt-10 text-red-500">
        <h2 className="text-2xl font-bold mb-4">예상치 못한 오류가 발생했습니다</h2>
        <p>{String(error)}</p>
      </div>
    );
  }
}
