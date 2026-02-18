import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { collectArtistsFromPlaylistForScript } from '@/features/recommend/hooks/collectArtistsFromPlaylist';
import { generateArtistPositions } from '@/features/recommend/hooks/generateArtistPositions';
import type { ArtistMapData, ArtistsDetail } from '@/features/recommend/types/artistMap';
import fs from 'fs';
import path from 'path';

/**
 * Spotify API에서 아티스트 상세 정보 가져오기
 */
async function fetchArtistDetails(artistIds: string[]): Promise<ArtistsDetail[]> {
  const token = await getSpotifyToken();
  const batchSize = 50;
  const artists: ArtistsDetail[] = [];

  for (let i = 0; i < artistIds.length; i += batchSize) {
    const batch = artistIds.slice(i, i + batchSize);
    const res = await fetch(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Failed to fetch artist details: ${res.status} ${res.statusText} - ${errorText}`);
      throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    artists.push(...data.artists);
  }

  return artists;
}

/**
 * Spotify 토큰 가져오기 (기존 로직 활용)
 * TODO: 공통 훅으로 분리 필요
 */
async function getSpotifyToken(): Promise<string> {
  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

/**
 * 아티스트 맵 생성 (전체 파이프라인)
 */
async function generateArtistMapData(
  playlistId: string = '4XoRh7gJq3VT1AO5GHEdd2',
  limit: number = 200
): Promise<ArtistMapData> {
  const artistMap = await collectArtistsFromPlaylistForScript(playlistId, limit);
  const artistIds = Array.from(artistMap.keys());

  const artistDetails = await fetchArtistDetails(artistIds);

  const positioned = generateArtistPositions(
    artistDetails.map((a) => ({
      id: a.id,
      name: a.name,
      spotifyUrl: a.external_urls.spotify,
      popularity: a.popularity,
      genres: a.genres,
      imageUrl: a.images[0]?.url,
    })),
    {
      width: 1200,
      height: 1000,
      padding: 50,
      minDistance: 15,
    }
  );

  return {
    generatedAt: new Date().toISOString(),
    totalArtists: positioned.length,
    canvasWidth: 1200,
    canvasHeight: 1000,
    artists: positioned,
  };
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    // 여러 플레이리스트 믹스 가능
    const playlists = [{ id: '4XoRh7gJq3VT1AO5GHEdd2', name: 'Grammys' }];

    const allArtists = new Map();

    for (const playlist of playlists) {
      const data = await generateArtistMapData(playlist.id, 100);

      data.artists.forEach((artist) => {
        if (!allArtists.has(artist.id)) {
          allArtists.set(artist.id, artist);
        }
      });
    }

    const finalData = {
      generatedAt: new Date().toISOString(),
      totalArtists: allArtists.size,
      canvasWidth: 1200,
      canvasHeight: 1000,
      artists: Array.from(allArtists.values()),
    };

    // JSON 저장
    const outputDir = path.join(process.cwd(), 'public', 'data');
    const outputPath = path.join(outputDir, 'artist-map.json');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 2));
  } catch (error) {
    console.error('main Error:', error);
    process.exit(1);
  }
}

main();

// pnpm exec tsx src/scripts/generateArtistMapData.ts
