import { NextResponse } from 'next/server';

import { getSpotifyRedirectUri } from '@/lib/utils/baseUrl';

export async function GET() {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const redirectUri = getSpotifyRedirectUri();

    if (!clientId) {
      console.error('SPOTIFY_CLIENT_ID is not configured');
      return NextResponse.json(
        { error: 'Spotify authentication is not configured' },
        { status: 500 }
      );
    }

    if (!redirectUri) {
      console.error('Redirect URI could not be determined');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const scope = [
      'user-read-private',
      'user-read-email',
      'streaming',
      'user-read-playback-state',
      'user-modify-playback-state',
    ].join(' ');

    const authUrl = 'https://accounts.spotify.com/authorize';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scope,
    });

    const loginUrl = `${authUrl}?${params.toString()}`;
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error('Spotify login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Spotify login' },
      { status: 500 }
    );
  }
}
