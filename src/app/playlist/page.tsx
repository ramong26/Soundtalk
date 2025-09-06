import HowPlaylist from '@/features/playlist/components/HowPlaylist';
import SubmitPlaylist from '@/features/playlist/components/SubmitPlaylist';

export const metadata = {
  title: 'Import Spotify Playlists',
  description: 'Easily import your favorite Spotify playlists',
};

export default function PlaylistPage() {
  return (
    <main className="flex mt-[188px] gap-4 h-[617px] w-[1043px] mx-auto">
      <div className="flex flex-col gap-10 w-full">
        <HowPlaylist />
        <SubmitPlaylist />
      </div>
    </main>
  );
}
