export type ArtistMapItem = {
  id: string;
  name: string;
  weight: number;
  x: number;
  y: number;
};

export type ArtistMapData = {
  center: {
    name: string;
    x: number;
    y: number;
  };
  items: ArtistMapItem[];
};
