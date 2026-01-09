import { getBaseUrl } from '@/lib/utils/baseUrl';
import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';
import TrackClient from '@/features/tracks/components/TrackClient';
import { Suspense } from 'react';

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

  console.log('[TrackPage] Loading track:', id);

  if (!baseUrl) {
    console.error('[TrackPage] BASE_URL not configured');
    return <div className="text-center mt-10 text-red-500">Configuration error: BASE_URL is not set</div>;
  }

  try {
    const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
      cache: 'no-store',
    });

    console.log('[TrackPage] Fetch response:', res.status);

    if (!res.ok) {
      console.error('[TrackPage] Fetch failed:', res.status, res.statusText);
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold mb-4">트랙 정보를 불러올 수 없습니다</h2>
          <p>Status: {res.status}</p>
        </div>
      );
    }

    const { track, album } = await res.json();

    console.log('[TrackPage] Data loaded:', {
      hasTrack: !!track,
      hasAlbum: !!album,
    });

    if (!track || !album) {
      console.error('[TrackPage] Missing track or album data');
      return <div className="text-center mt-10 text-red-500">트랙 또는 앨범 정보가 없습니다</div>;
    }

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <TrackDescription album={album} />
        <Suspense fallback={<div className="h-96 animate-pulse bg-gray-200" />}>
          <TrackClient trackId={id} album={album} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('[TrackPage] Unexpected error:', error);
    return (
      <div className="text-center mt-10 text-red-500">
        <h2 className="text-2xl font-bold mb-4">예상치 못한 오류가 발생했습니다</h2>
        <p className="text-sm text-gray-600">{String(error)}</p>
      </div>
    );
  }
}
