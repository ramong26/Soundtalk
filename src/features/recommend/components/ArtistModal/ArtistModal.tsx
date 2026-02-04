'use client';

import Image from 'next/image';
import type { ArtistModalProps } from './types';

export default function ArtistModal({ artist, onClose }: ArtistModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
      aria-modal="true"
      aria-labelledby="artist-modal-title"
      onClick={onClose}
    >
      <div className="bg-white p-6 rounded-xl w-[400px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {artist.imageUrl && (
          <Image
            src={artist.imageUrl}
            alt={artist.name}
            width={200}
            height={200}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <h2 className="text-2xl font-bold text-black mb-2">{artist.name}</h2>

        {artist.genres && artist.genres.length > 0 && (
          <p className="text-sm text-neutral-400 mb-4">{artist.genres.slice(0, 3).join(', ')}</p>
        )}

        <div className="mb-4">
          <div className="text-xs text-neutral-500 mb-1">Popularity: {artist.popularity}/100</div>
          <div className="w-full bg-neutral-800 rounded-full h-2">
            <div className="bg-pink-500 h-2 rounded-full transition-all" style={{ width: `${artist.popularity}%` }} />
          </div>
        </div>

        <div className="space-y-3">
          <a
            href={artist.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#FFD460] hover:bg-[#E6B44B] text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            🎵 Spotify에서 보기
          </a>

          <a
            href={artist.youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-[#FF4C4C] hover:bg-[#E04343] text-white text-center py-3 rounded-lg font-semibold transition-colors"
          >
            📺 YouTube에서 검색
          </a>
        </div>

        <button
          onClick={onClose}
          aria-label="Close modal"
          className="mt-4 w-full text-sm text-neutral-500 hover:text-white transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
