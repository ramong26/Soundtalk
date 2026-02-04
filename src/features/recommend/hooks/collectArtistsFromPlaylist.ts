import getTopTrackPlaylist from '@/features/chart/hooks/getTopTrackPlaylist';
import { fetchPlaylistTracksForScript } from '../lib/spotifyPlaylistFetcher';
import { fetchPlaylistTracksForScriptParams } from '../lib/spotifyPlaylistFetcher';
import { TrackItem } from '@/shared/types/spotifyTrack';
import { ArtistSimplified } from '../types/artistMap';

interface SpotifyArtistSimple {
  id: string;
  name: string;
  external_urls: { spotify: string };
}

/**
 * 클라이언트/서버 컴포넌트용 (getTopTrackPlaylist 사용)
 */
export async function collectArtistsFromPlaylist(
  playlistId: string,
  limit: number = 200
): Promise<Map<string, SpotifyArtistSimple>> {
  const tracks = await getTopTrackPlaylist({ playlistId, limit });

  const artistMap = new Map<string, SpotifyArtistSimple>();

  tracks.forEach((item: TrackItem) => {
    const track = item.track;
    if (!track || !track.artists) return;

    track.artists.forEach((artist: SpotifyArtistSimple) => {
      if (artist.id && !artistMap.has(artist.id)) {
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
          external_urls: artist.external_urls,
        });
      }
    });
  });

  return artistMap;
}

/**
 * 스크립트용 (직접 Spotify API 호출)
 */
export async function collectArtistsFromPlaylistForScript(
  playlistId: string,
  limit: number = 200
): Promise<Map<string, SpotifyArtistSimple>> {
  const tracks = await fetchPlaylistTracksForScript(playlistId, 0, limit);

  const artistMap = new Map<string, SpotifyArtistSimple>();
  tracks.forEach((item: fetchPlaylistTracksForScriptParams) => {
    const track = item.track;
    if (!track || !track.artists) return;

    (track.artists as unknown as ArtistSimplified[]).forEach((artist) => {
      if (artist.id && !artistMap.has(artist.id)) {
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
          external_urls: artist.external_urls,
        });
      }
    });
  });

  return artistMap;
}
