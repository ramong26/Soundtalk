import Image from 'next/image';

import { TrackItem } from '@/shared/types/spotifyTrack';

interface RecommendCardProps {
  track: TrackItem;
}

export default function RecommendCard({ track }: RecommendCardProps) {
  const actualTrack = track.track;
  const albumUrl = actualTrack?.album.external_urls.spotify;

  if (!actualTrack || !albumUrl) {
    return <div className="text-red-500">Track information is not available.</div>;
  }

  return (
    <a
      href={albumUrl}
      className="border-4 border-black bg-white shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000] transition-all duration-200 cursor-pointer flex flex-col"
    >
      <Image
        src={actualTrack?.album?.images[0]?.url}
        alt={actualTrack?.name}
        width={300}
        height={300}
        className="w-full h-60 object-cover border-b-4 border-black"
      />
      <div className="p-4">
        <h3 className="text-lg font-extrabold uppercase truncate">{actualTrack?.name}</h3>
        <p className="text-sm font-semibold text-neutral-700 truncate">
          {actualTrack?.artists[0]?.name}
        </p>
      </div>
    </a>
  );
}
