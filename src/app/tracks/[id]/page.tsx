import { getBaseUrl } from '@/lib/utils/baseUrl';
import TrackDescription from '@/features/tracks/components/TrackDescription/TrackDescription';
import TrackClient from '@/features/tracks/components/TrackClient';

export const metadata = {
  title: 'Track Page',
  description: 'Details about the track',
};

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TrackPage({ params }: PageProps) {
  try {
    const { id } = await params;
    const baseUrl = getBaseUrl();

    console.log('[TrackPage] START - id:', id, 'baseUrl:', baseUrl);

    if (!id) {
      console.error('[TrackPage] Missing ID');
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold">잘못된 트랙 ID입니다</h2>
        </div>
      );
    }

    if (!baseUrl) {
      console.error('[TrackPage] Missing baseUrl');
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold">Configuration error: BASE_URL is not set</h2>
        </div>
      );
    }

    // 백틱(`)으로 수정!
    const url = `${baseUrl}/api/tracks/${id}`;
    console.log('[TrackPage] Fetching from:', url);

    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[TrackPage] Fetch complete - status:', res.status);

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error');
      console.error('[TrackPage] Fetch failed:', {
        status: res.status,
        statusText: res.statusText,
        error: errorText,
      });

      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold mb-4">트랙 정보를 불러올 수 없습니다</h2>
          <p className="text-sm">Status: {res.status}</p>
          <p className="text-xs mt-2 text-gray-600">{errorText.substring(0, 200)}</p>
        </div>
      );
    }

    const data = await res.json();
    console.log('[TrackPage] Data received:', {
      hasTrack: !!data?.track,
      hasAlbum: !!data?.album,
      trackName: data?.track?.name,
    });

    if (!data || !data.track || !data.album) {
      console.error('[TrackPage] Invalid data structure:', data);
      return (
        <div className="text-center mt-10 text-red-500">
          <h2 className="text-2xl font-bold">트랙 또는 앨범 정보가 없습니다</h2>
        </div>
      );
    }

    const { track, album } = data;

    console.log('[TrackPage] Rendering UI for track:', track.name);

    return (
      <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
        <div className="p-4 bg-blue-100 border-2 border-blue-500 mb-4">
          <p className="text-xl font-bold">✅ 서버 렌더링 성공!</p>
          <p className="text-sm">Track: {track.name}</p>
          <p className="text-sm">Album: {album.name}</p>
        </div>

        <TrackDescription album={album} />

        <div className="p-4 bg-green-100 border-2 border-green-500 my-4">
          <p className="text-xl font-bold">✅ TrackDescription 렌더링 완료</p>
        </div>

        <TrackClient trackId={id} album={album} />
      </div>
    );
  } catch (error) {
    console.error('[TrackPage] FATAL ERROR:', error);
    console.error('[TrackPage] Error stack:', error instanceof Error ? error.stack : 'No stack');

    return (
      <div className="text-center mt-10 text-red-500 p-8 border-4 border-red-500">
        <h2 className="text-2xl font-bold mb-4">❌ 예상치 못한 오류가 발생했습니다</h2>
        <p className="text-lg mb-2">{error instanceof Error ? error.message : String(error)}</p>
        <pre className="text-xs text-left bg-gray-100 p-4 mt-4 overflow-auto">
          {error instanceof Error ? error.stack : JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }
}
