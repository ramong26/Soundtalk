'use client';

import { useEffect, useRef, useState } from 'react';

import ArtistModal from './ArtistModal';

import type { ArtistMapItem } from '../types/artistMap';

interface Props {
  artists: ArtistMapItem[];
  canvasWidth: number;
  canvasHeight: number;
}

export default function ArtistMap({ artists, canvasWidth, canvasHeight }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(canvasWidth);
  const [selectedArtist, setSelectedArtist] = useState<ArtistMapItem | null>(null);

  const fixedHeight = 1500;

  useEffect(() => {
    function handleResize() {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaleX = width / canvasWidth;
  const scaleY = fixedHeight / canvasHeight;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#fdfbf7] overflow-hidden"
      style={{
        height: fixedHeight,
      }}
    >
      {artists.map((artist) => (
        <button
          key={artist.id}
          className="absolute text-xs text-purple-400 hover:text-purple-600"
          style={{
            left: artist.x * scaleX,
            top: artist.y * scaleY,
            transform: 'translate(-50%, -50%)',
            fontSize: `${Math.max(10, artist.popularity / 5) * scaleX}px`,
          }}
          onClick={() => setSelectedArtist(artist)}
        >
          {artist.name}
        </button>
      ))}

      {selectedArtist && <ArtistModal artist={selectedArtist} onClose={() => setSelectedArtist(null)} />}
    </div>
  );
}
