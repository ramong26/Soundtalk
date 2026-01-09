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
  console.log('Base URL:', baseUrl);
  const { id } = await params;

  const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // 에러 메시지 추출
    let errorMsg = '트랙 정보를 불러올 수 없습니다.';
    try {
      const err = await res.json();
      if (err?.error) errorMsg = err.error;
    } catch {}
    return (
      <div style={{ color: 'red', padding: 40, textAlign: 'center' }}>
        {errorMsg} (status: {res.status})
      </div>
    );
  }

  const { track, album } = await res.json();

  if (!track && !album) return null;

  return (
    <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
      {album && <TrackDescription album={album} />}
      {album && <TrackClient trackId={track.id} album={album} />}
    </div>
  );
}
