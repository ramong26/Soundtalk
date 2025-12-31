import { CustomSearchResult } from '@/features/tracks/types/custom-search';

const INTERVIEW_SITES = [
  'site:rollingstone.com',
  'site:billboard.com',
  'site:complex.com',
  'site:pitchfork.com',
  'site:koreanmusicjournal.com',
];

function getDateYearsAgo(years: number): string {
  const today = new Date();
  today.setFullYear(today.getFullYear() - years);
  return today.toISOString().split('T')[0];
}

export async function googleSearch(who: string): Promise<CustomSearchResult[]> {
  if (!who) return [];
  const mainWho = who.split(',')[0].trim();
  const afterDate = getDateYearsAgo(4);
  const query = `${mainWho} (${INTERVIEW_SITES.join(' OR ')}) after:${afterDate}`;

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) throw new Error('Google API Key or CSE ID is not configured');

  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error('Google API error');
  const data = await res.json();
  return Array.isArray(data)
    ? data.filter((item) => {
        const title = item.title?.toLowerCase() || '';
        return !title.includes('shorts') && !title.includes('reaction');
      })
    : [];
}
