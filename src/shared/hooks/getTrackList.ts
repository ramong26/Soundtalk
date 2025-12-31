import { UseQueryResult, useQuery } from '@tanstack/react-query';

import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';
import getAllTracks from '@/shared/hooks/getAllTracks';
import { TrackItem } from '@/shared/types/spotifyTrack';

const ONE_HOUR = 1000 * 60 * 60;

// 클라이언트에서 호출
export const useTrackList = (playlistId: string, offset = 0, limit = 50): UseQueryResult<TrackItem[]> => {
  return useQuery<TrackItem[]>({
    queryKey: ['track-list', playlistId, offset, limit],
    queryFn: () => getTopTrackPlaylist({ playlistId, offset, limit }),
    enabled: !!playlistId,
    staleTime: ONE_HOUR,
  });
};

export const useAllTracks = (playlistId?: string, select?: (data: TrackItem[]) => TrackItem[]) => {
  return useQuery({
    queryKey: ['all-tracks', playlistId],
    enabled: !!playlistId,
    queryFn: () => getAllTracks(playlistId!, 50),
    select,
  });
};

export const usePaginatedTrackList = (playlistId: string, page: number, limit = 50) => {
  const offset = (page - 1) * limit;

  return useQuery<TrackItem[]>({
    queryKey: ['paginated-track-list', playlistId, offset, limit],
    queryFn: () => getTopTrackPlaylist({ playlistId, offset, limit }),
    enabled: !!playlistId,
    staleTime: ONE_HOUR,
  });
};
