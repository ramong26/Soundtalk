import ArtistMap from '@/features/recommend/components/ArtistMap';
import { promises as fs } from 'fs';
import path from 'path';
import type { ArtistMapData } from '@/features/recommend/types/artistMap';

export const metadata = {
  title: 'Music Artist Map',
  description: 'Discover trending artists visually',
};

export const revalidate = 86400; // 24시간

export default async function RecommendPage() {
  const dataPath = path.join(process.cwd(), 'public', 'data', 'artist-map.json');
  let artistData: ArtistMapData;

  try {
    const fileContent = await fs.readFile(dataPath, 'utf-8');
    artistData = JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to load artist map data:', error);
    artistData = {
      generatedAt: new Date().toISOString(),
      totalArtists: 0,
      canvasWidth: 1200,
      canvasHeight: 800,
      artists: [],
    };
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#fdfbf7] py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">2026 GRAMMYS AWARDS</h1>
        <p className="text-neutral-400">Click any artist to explore · {artistData.totalArtists} artists</p>
        <p className="text-xs text-neutral-600 mt-1">
          Updated: {new Date(artistData.generatedAt).toLocaleDateString()}
        </p>
      </div>

      <ArtistMap
        artists={artistData.artists}
        canvasWidth={artistData.canvasWidth}
        canvasHeight={artistData.canvasHeight}
      />
    </div>
  );
}
