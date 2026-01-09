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

  const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
    cache: 'no-store',
  });

  if (!baseUrl) {
    return <div className="text-center mt-10 text-red-500">Configuration error: BASE_URL is not set</div>;
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
