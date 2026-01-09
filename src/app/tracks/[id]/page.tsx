import { getBaseUrl } from '@/lib/utils/baseUrl';
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
  const baseUrl = getBaseUrl();
  const { id } = await params;

  const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
    cache: 'no-store',
  });

  console.log('Fetch track data response status:', res);
  console.error('Fetch track data response status:', res);
  if (!res.ok) return null;

  const { track, album } = await res.json();

  if (!track) return null;

  return (
    <div>
      {album && <TrackDescription album={album} />}
      <TrackClient trackId={track.id} album={album} />
    </div>
  );
}
