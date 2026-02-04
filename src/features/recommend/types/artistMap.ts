export interface ArtistMapItem {
  id: string;
  name: string;
  spotifyUrl: string;
  youtubeSearchUrl: string;
  popularity: number;
  genres?: string[];
  imageUrl?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ArtistMapData {
  generatedAt: string;
  totalArtists: number;
  canvasWidth: number;
  canvasHeight: number;
  artists: ArtistMapItem[];
}

export interface ArtistsDetail {
  external_urls: { spotify: string };
  followers: { href: string | null; total: number };
  genres: string[];
  href: string;
  id: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface ArtistSimplified {
  external_urls: { spotify: string };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}
