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

  if (!id || typeof id !== 'string') {
    return <div className="text-center mt-10 text-red-500">Invalid track ID</div>;
  }

  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    return <div className="text-center mt-10 text-red-500">Configuration error: BASE_URL is not set</div>;
  }

  try {
    const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Track fetch failed:', {
        status: res.status,
        trackId: id,
        error: errorData,
      });

      return (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-bold text-red-500 mb-4">트랙 정보를 불러올 수 없습니다</h2>
          <p className="text-gray-600">{errorData?.error || `Error ${res.status}`}</p>
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
        <TrackClient album={album} trackId={id} />
      </div>
    );
  } catch (error) {
    console.error('Unexpected error in TrackPage:', error);
    return <div className="text-center mt-10 text-red-500">예상치 못한 오류가 발생했습니다</div>;
  }
}
