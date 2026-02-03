'use server';

export async function getFmTopArtist() {
  const res = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${process.env.LAST_FM_API_KEY}&format=json&limit=1`,
    { cache: 'no-store' }
  );

  if (!res.ok) {
    throw new Error(`Last.fm API error: ${res.status}`);
  }

  const data = await res.json();

  const topArtist = data?.artists?.artist?.[0];

  if (!topArtist) {
    throw new Error('No top artist found in Last.fm response');
  }

  return {
    name: topArtist.name,
    mbid: topArtist.mbid || '',
  };
}
