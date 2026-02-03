'use server';

export async function getSimilarArtists(artistName: string) {
  const res = await fetch(
    `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artistName)}&api_key=${process.env.LAST_FM_API_KEY}&format=json&limit=20`
  );

  if (!res.ok) {
    throw new Error(`Last.fm API error: ${res.status}`);
  }

  const data = await res.json();
  const artists = data?.similarartists?.artist;

  return artists;
}
