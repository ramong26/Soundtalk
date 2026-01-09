import { getTrackData } from '@/features/tracks/lib/spotify/actions';
import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';
import TrackClient from '@/features/tracks/components/TrackClient';

export const metadata = {
  title: 'Track Page',
  description: 'Details about the track',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TrackPage({ params }: PageProps) {
  const { id } = await params;

  console.log('[TrackPage] Rendering for id:', id);

  try {
    const { track, album } = await getTrackData(id);

    if (!track || !album) {
      return (
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-red-500">트랙 정보를 찾을 수 없습니다.</h1>
        </div>
      );
    }

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <TrackDescription album={album} />
        <TrackClient trackId={track.id} album={album} />
      </div>
    );
  } catch (error) {
    console.error('[TrackPage] Error:', error);

    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-red-500">트랙 정보를 불러오는 중 오류가 발생했습니다.</h1>
        <p className="text-gray-600 mt-2">{error instanceof Error ? error.message : '알 수 없는 오류'}</p>
      </div>
    );
  }
}
