import HowPlaylist from '@/features/playlist/components/HowPlaylist';
import SubmitPlaylist from '@/features/playlist/components/SubmitPlaylist';

export const metadata = {
  title: 'Import Spotify Playlists',
  description: 'Easily import your favorite Spotify playlists',
};

export default function PlaylistPage() {
  return (
    <div className="flex flex-col items-center w-[1272px] mx-auto">
      <HowPlaylist />
      <SubmitPlaylist />
    </div>
  );
}
