import HowPlaylist from '@/features/playlist/components/HowPlaylist';
import SubmitPlaylist from '@/features/playlist/components/SubmitPlaylist';

export const metadata = {
  title: 'Import Spotify Playlists',
  description: 'Easily import your favorite Spotify playlists',
};

export default function PlaylistPage() {
  return (
    <div className="w-auto max-w-[1286px] lg:mx-auto mx-4">
      <HowPlaylist />
      <SubmitPlaylist />
    </div>
  );
}
