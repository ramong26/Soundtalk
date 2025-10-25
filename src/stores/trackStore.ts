import { create } from 'zustand';

import { Album } from '@/shared/types/spotifyTrack';
import { Track } from '@/shared/types/spotifyTrack';

interface TrackStore {
  album: Album | null;
  track: Track | null;
  trackId: string | null;
  tracks: Track[];
  setAlbum: (album: Album | null) => void;
  setTrack: (track: Track | null) => void;
  setTrackId: (trackId: string | null) => void;
  setTracks: (tracks: Track[]) => void;
  clear: () => void;
}

export const useTrackStore = create<TrackStore>((set) => ({
  album: null,
  track: null,
  trackId: null,
  tracks: [],
  setAlbum: (album) => set({ album }),
  setTrack: (track) => set({ track }),
  setTrackId: (trackId) => set({ trackId }),
  setTracks: (tracks) => set({ tracks }),
  clear: () => set({ album: null, track: null, trackId: null, tracks: [] }),
}));
