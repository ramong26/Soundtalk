import { TrackItem } from '@/shared/types/spotifyTrack';

export interface ChartComponentProps {
  tracksList: TrackItem[];
  title: string;
  className?: string;
}
