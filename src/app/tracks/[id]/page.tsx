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
  const { track, album } = await res.json();

  return (
    <div className="h-screen ">
      <main className="flex flex-col mt-[250px] gap-4 h-[617px] w-[1043px] mx-auto">
        {album && <TrackDescription album={album} />}
        {album && <TrackClient trackId={track.id} album={album} track={track} />}
      </main>
    </div>
  );
}
