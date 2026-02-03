'use client';

import { useEffect, useState } from 'react';
import getTodayArtistMap from '../components/getTodayArtistMap';
import type { ArtistMapData } from '../types/artistmap';

export function useTodayMap(userToken?: string) {
  const [data, setData] = useState<ArtistMapData | null>(null);

  useEffect(() => {
    getTodayArtistMap().then(setData);
  }, [userToken]);

  return data;
}
