import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@ramong26/xp-components';

import { CharTopCircleProps } from './typex';

export default function CharTopCircle({ track }: CharTopCircleProps) {
  return (
    <div className=" relative group">
      <div className="rounded-full border-8 border-black shadow-[8px_8px_0px_#D65361] overflow-hidden">
        <Image
          width={500}
          height={500}
          src={track.album?.images?.[0]?.url}
          alt={`Album cover of ${track.name}`}
          priority
          className="rounded-full group-hover:rotate-6 transition-transform duration-500"
        />
      </div>
      <Button variant="default" className="absolute -bottom-4 left-1/2 -translate-x-1/2 lg:py-1 md:px-2">
        <Link href={`/tracks/${track.id}`}>#1 HIT</Link>
      </Button>
    </div>
  );
}
