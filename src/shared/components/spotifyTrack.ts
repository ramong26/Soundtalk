export interface TrackItem {
  track: Track;
}

export interface Track {
  album: Album;
  artists: Artist[];
  name: string;
  id: string;
}
export interface Artist {
  id: string;
  name: string;
  images: Images[];
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}
export interface Album {
  external_urls: {
    spotify: string;
  };
  artists: Artist[];
  id: string;
  images: Images[];
  name: string;
  release_date: string;
  total_tracks: number;
  type: string;
  tracks: {
    items: TrackId[];
  };
}
export interface Images {
  url: string;
  height: number;
  width: number;
}

export interface TrackId {
  artists: Artist[];
  name: string;
  id: string;
  album: {
    images: Images[];
  };
  external_urls: {
    spotify: string;
  };
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  type: string;
}
