export const runtime = 'nodejs';

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  if (!clientId || !clientSecret) {
    console.error('Spotify 환경 변수 누락! clientId:', clientId, 'clientSecret:', clientSecret);
    return new Response(JSON.stringify({ error: 'Missing Spotify env variables', clientId, clientSecret }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  console.log('base64 auth:', auth);
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
    }),
  });

  const data = await tokenRes.json();

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
