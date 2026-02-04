/**
 * @description 스크립트용 Spotify 플레이리스트 트랙 조회
 */

export interface fetchPlaylistTracksForScriptParams {
  added_at: string;
  added_by: {
    external_urls: Array<[]>;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: boolean;
  primary_color: string | null;
  track: {
    preview_url: string | null;
    available_markets: string[];
    explicit: boolean;
    type: string;
    album: Array<[]>;
    artists: Array<[]>;
    disc_number: number;
    track_number: number;
    duration_ms: number;
    external_ids: {
      isrc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    popularity: number;
    uri: string;
    is_local: boolean;
  };
  video_thumbnail: { url: string | null };
}

export async function fetchPlaylistTracksForScript(
  playlistId: string,
  offset: number = 0,
  limit: number = 50
): Promise<fetchPlaylistTracksForScriptParams[]> {
  const token = await getSpotifyTokenForScript();

  // Spotify limit 최대 100
  const MAX_LIMIT = 100;
  let allItems: fetchPlaylistTracksForScriptParams[] = [];
  let fetched = 0;

  while (fetched < limit) {
    const fetchLimit = Math.min(MAX_LIMIT, limit - fetched);

    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset + fetched}&limit=${fetchLimit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!playlistRes.ok) {
      console.error('Error fetching playlist:', await playlistRes.text());
      throw new Error('Failed to fetch playlist');
    }

    const data = await playlistRes.json();
    allItems = allItems.concat(data.items);

    if (data.items.length < fetchLimit) break;
    fetched += fetchLimit;
  }
  return allItems;
}

/**
 * 스크립트용 Spotify 토큰 발급
 */
export async function getSpotifyTokenForScript(): Promise<string> {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    throw new Error('Missing Spotify credentials. Add SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET to .env.local');
  }

  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Spotify token');
  }

  const data = await response.json();
  return data.access_token;
}
