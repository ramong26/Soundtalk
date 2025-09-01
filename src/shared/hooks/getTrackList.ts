import { useQuery } from '@tanstack/react-query';

import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';
import getAllTracks from '@/shared/hooks/getAllTracks';
import { TrackItem } from '../types/spotifyTrack';
const ONE_HOUR = 1000 * 60 * 60;

export async function getTrackList({
  playlistId,
  offset = 0,
  limit = 50,
}: {
  playlistId?: string;
  offset?: number;
  limit?: number;
} = {}) {
  const finalPlaylistId = playlistId || '1Gg5BI7b5xljyHnGXXrX0E';
  const tracksList = await getTopTrackPlaylist({
    playlistId: finalPlaylistId,
    offset,
    limit,
  });

  return tracksList;
}
// 사용법:   const tracksList = await getTrackList();

export const useTrackList = (playlistId: string, offset = 0, limit = 50) => {
  console.log(`Fetching tracks for playlistId: ${playlistId}, offset: ${offset}, limit: ${limit}`);
  return useQuery({
    queryKey: ['track-list', playlistId, offset, limit],
    queryFn: () => getTopTrackPlaylist({ playlistId, offset, limit }),
    enabled: !!playlistId,
    staleTime: ONE_HOUR,
  });
};

export const useAllTracks = (playlistId?: string, select?: (data: TrackItem[]) => TrackItem[]) => {
  console.log(`Fetching all tracks for playlistId: ${playlistId}`);
  return useQuery({
    queryKey: ['all-tracks', playlistId],
    enabled: !!playlistId,
    queryFn: () => getAllTracks(playlistId!, 50),
    select,
  });
};
