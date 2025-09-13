import Image from 'next/image';
import ArtistProfileWiki from '@/features/tracks/interview/components/ArtistProfileWiki';
import { Artist } from '@/shared/types/spotifyTrack';

export default function ArtistProfile({ artist }: { artist: Artist | null }) {
  const artistName = artist?.name;

  return (
    <section className="lg:mt-12 md:mt-8 mt-6 lg:gap-12 gap-8 w-full lg:p-8 md:p-6 p-4 flex  flex-col items-center justify-between bg-[#fdfbf7] border-4 border-black shadow-[6px_6px_0px_#000] ">
      {/* 앨범 커버*/}
      <div className=" relative group">
        <div className="rounded-full border-8 border-black shadow-[8px_8px_0px_#D65361] overflow-hidden">
          <Image
            width={500}
            height={500}
            src={artist?.images?.[0]?.url || '/default-artist.png'}
            alt={`Album cover of ${artist?.name}`}
            priority
            className="rounded-full group-hover:rotate-6 transition-transform duration-500"
          />
        </div>
        <div className="font-bold lg:text-xl text-md  lg:px-6 md:px-4 px-[12px] lg:py-2 py-1 absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#FFD460] text-black border-2 border-black shadow-[3px_3px_0px_#000]">
          {artist?.name || 'Unknown Artist'}
        </div>
      </div>

      {/* 위키 스타일 설명 */}
      <ArtistProfileWiki artistName={artistName} />
    </section>
  );
}
