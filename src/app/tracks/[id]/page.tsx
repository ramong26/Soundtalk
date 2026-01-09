import { getBaseUrl } from '@/lib/utils/baseUrl';
import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';

import TrackClient from '@/features/tracks/components/TrackClient';

export const metadata = {
  title: 'Track Page',
  description: 'Details about the track',
};

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

interface PageProps {
  params: { id: string };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TrackPage({ params }: PageProps) {
  const baseUrl = getBaseUrl();
  const { id } = params;

  const res = await fetch(`${baseUrl}/api/tracks/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return <div>Failed to load track</div>;
  }

  const { track, album } = await res.json();

  if (!track) {
    return <div>No track data</div>;
  }

  return (
    <div>
      {album && <TrackDescription album={album} />}
      <TrackClient trackId={track.id} album={album} />
    </div>
  );
}
