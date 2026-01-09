import { getClientCredentialsToken } from '@/lib/spotify/spotifyTokenManager';

export const runtime = 'nodejs';

export async function GET() {
  const token = await getClientCredentialsToken();
  return Response.json({ access_token: token });
}
