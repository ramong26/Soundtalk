import type { ArtistMapItem } from '../../types/artistMap';

export interface ArtistModalProps {
  artist: ArtistMapItem;
  onClose: () => void;
}
