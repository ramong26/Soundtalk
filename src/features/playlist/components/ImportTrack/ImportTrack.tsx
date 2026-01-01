'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { ImportCardProps } from './types';

function ImportTrack({
  tracksList = [],
  className = '',
  isLoading = false,
  link = true,
  skeletonCount,
}: ImportCardProps) {
  const skeletonItemsCount = skeletonCount ?? Math.max(6, tracksList.length || 6);

  const renderSkeletonItems = useMemo(
    () =>
      Array.from({ length: skeletonItemsCount }, (_, index) => (
        <div
          key={`skeleton-${index}`}
          className={`md:px-3 px-1 flex flex-col items-center gap-3 md:gap-4 cursor-pointer hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
            tracksList.length - 1 === index ? '' : 'border-r-2 border-dashed border-black/30'
          }`}
          style={{ minWidth: '90px', maxWidth: '150px', width: '100%' }}
          aria-hidden
        >
          <div className="md:w-[120px] w-[80px] md:h-[120px] h-[80px] rounded-lg border-4 border-black shadow-[3px_3px_0px_#D65361] bg-gray-100" />
          <div className="flex flex-col items-center text-black gap-1 text-center">
            <div className="md:text-base text-xs md:max-w-[110px] max-w-[80px] font-bold truncate uppercase h-[1em] bg-gray-200 rounded" />
            <div className="lg:text-lg md:text-sm text-xs md:max-w-[110px] max-w-[80px] text-gray-700 truncate italic h-[0.9em] bg-gray-100 rounded" />
          </div>
        </div>
      )),
    [skeletonItemsCount, tracksList.length]
  );

  const renderedTracks = useMemo(
    () =>
      (tracksList ?? []).map((track, index) => {
        const key = `${track.track.id}`;

        if (link) {
          return (
            <Link href={track.track.album.external_urls.spotify ?? '#'} key={key}>
              <div
                className={`md:px-3 px-1 flex flex-col items-center gap-3 md:gap-4 cursor-pointer hover:rotate-1 hover:-translate-y-2 transition-transform duration-300 ${
                  tracksList.length - 1 === index ? '' : 'border-r-2 border-dashed border-black/30'
                }`}
                style={{ minWidth: '90px', maxWidth: '150px', width: '100%' }}
              >
                <Image
                  src={track.track.album.images[0]?.url || '/placeholder-image.png'}
                  alt={track.track.name}
                  width={120}
                  height={120}
                  className="md:w-[110px] w-[80px] md:h-[110px] h-[80px] rounded-lg border-4 border-black shadow-[3px_3px_0px_#D65361] object-cover"
                />
                <div className="flex flex-col items-center text-black gap-1 text-center w-full">
                  <div className="md:text-base text-xs md:max-w-[110px] max-w-[80px] font-bold truncate uppercase">
                    {track.track.name}
                  </div>
                  <div className="lg:text-lg md:text-sm text-xs md:max-w-[110px] max-w-[80px] text-gray-700 truncate italic">
                    {track.track.artists.map((artist) => artist.name).join(', ')}
                  </div>
                </div>
              </div>
            </Link>
          );
        }

        return (
          <div
            key={key}
            className="flex items-center gap-3 md:gap-4 mb-4 border-b border-black/20 pb-3 w-full h-[70px]"
          >
            <Image
              src={track.track.album.images[0]?.url || '/placeholder-image.png'}
              alt={track.track.name}
              width={50}
              height={50}
              className="rounded-lg object-cover"
            />
            <div className="flex flex-col overflow-hidden w-full">
              <div className="font-bold text-base md:text-lg truncate">{track.track.name}</div>
              <div className="max-w-md text-xs md:text-sm text-gray-600 truncate">
                {track.track.artists.map((artist) => artist.name).join(', ')}
              </div>
            </div>
          </div>
        );
      }),
    [tracksList, link]
  );

  return (
    <section className={`w-full relative border-2 border-black py-4 md:py-6 mt-8 bg-white shadow-md ${className}`}>
      <div className="relative top-[-24px] lg:text-2xl md:text-xl text-base font-extrabold px-[10px] h-[54px] flex items-center text-black bg-[#FFD460] border-t-4 border-b-4 border-black shadow-[0_4px_0_#000] uppercase tracking-wide">
        <div>🔥 트랙 미리보기</div>
      </div>

      <div className="relative w-full pt-[10px] overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400">
        <div className="flex gap-3 md:gap-6 animate-scroll">{isLoading ? renderSkeletonItems : renderedTracks}</div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-40%);
          }
        }
        .animate-scroll {
          width: max-content;
          display: flex;
          animation: scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default React.memo(ImportTrack);
