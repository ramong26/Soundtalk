export interface ArtistNode {
  id: string;
  name: string;
  imageUrl: string;
  source: 'lastfm' | 'spotify' | 'seed';
  genres: string[];
}

export interface ArtistEdge {
  source: string;
  target: string;
  weight: number;
}

export interface ArtistGraph {
  nodes: ArtistNode[];
  edges: ArtistEdge[];
}
