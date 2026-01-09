export const runtime = 'nodejs';

let cachedToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function GET() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return Response.json({ access_token: cachedToken.accessToken });
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
    console.error(await res.text());
    return new Response('Spotify token error', { status: 500 });
  }

  const data = await res.json();

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60_000,
  };

  return Response.json(data);
}
