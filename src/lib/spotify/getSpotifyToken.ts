export async function getSpotifyToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Spotify env missing');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  console.log('Spotify auth string:', auth);
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  console.log('Spotify token fetch response:', res);
  if (!res.ok) {
    console.error(await res.text());
    throw new Error('Failed to fetch Spotify token in getSpotifyToken');
  }

  return res.json() as Promise<{ access_token: string }>;
}
