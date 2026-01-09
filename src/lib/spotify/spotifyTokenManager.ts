let cachedToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function getClientCredentialsToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  if (!res.ok) {
    throw new Error(`Spotify token error: ${await res.text()}`);
  }

  const data = await res.json();

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.accessToken;
}
