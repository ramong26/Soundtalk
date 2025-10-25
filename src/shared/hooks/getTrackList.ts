import { UseQueryResult, useQuery } from '@tanstack/react-query';

import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';
import getAllTracks from '@/shared/hooks/getAllTracks';
import { TrackItem } from '@/shared/types/spotifyTrack';

const ONE_HOUR = 1000 * 60 * 60;

// 서버에서 직접 호출

// 사용법:   const tracksList = await getTrackList();
export async function getTrackList({
  playlistId,
  offset = 0,
  limit = 50,
}: {
  playlistId?: string;
  offset?: number;
  limit?: number;
} = {}): Promise<TrackItem[]> {
  const finalPlaylistId = playlistId || '1Gg5BI7b5xljyHnGXXrX0E';
  const tracksList = await getTopTrackPlaylist({
    playlistId: finalPlaylistId,
    offset,
    limit,
  });

  return tracksList;
}

// 클라이언트에서 호출

export const useTrackList = (
  playlistId: string,
  offset = 0,
  limit = 50
): UseQueryResult<TrackItem[]> => {
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
