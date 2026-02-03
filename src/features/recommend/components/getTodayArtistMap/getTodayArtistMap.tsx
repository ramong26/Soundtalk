'use server';

import { getFmTopArtist } from '../../hooks/getFmTopArtist';
import { getSimilarArtists } from '../../hooks/getSimilarArtists';
import { radialLayout } from '../../hooks/radialLayout';
import { LastFmArtist } from '@/shared/types/lastFm';
function calcWeight(match: number): number {
  return Math.floor(match * 100);
}

export default async function getTodayArtistMap() {
  const topArtist = await getFmTopArtist();

  const similar = await getSimilarArtists(topArtist.name);

  const weighted = similar.map((a: LastFmArtist) => ({
    id: a.name,
    name: a.name,
    weight: calcWeight(Number(a.match)),
  }));

  const positioned = radialLayout({
    center: { x: 0, y: 400 },
    items: weighted,
  });

  return {
    center: {
      name: topArtist.name,
      x: 0,
      y: 400,
    },
    items: positioned.slice(0, 12),
  };
}
