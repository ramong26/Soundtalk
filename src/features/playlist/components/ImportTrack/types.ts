import { TrackItem } from '@/shared/types/spotifyTrack';

export interface ImportCardProps {
  tracksList?: TrackItem[];
  className?: string;
  isLoading?: boolean;
  link?: boolean;
  skeletonCount?: number;
}
