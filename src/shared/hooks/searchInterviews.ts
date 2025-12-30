import { CustomSearchResult } from '@/features/tracks/types/custom-search';
import { getBaseUrl } from '@/lib/utils/baseUrl';
import { formatDate } from '@/lib/utils/date';
import { YouTubeItem } from '@/shared/types/youtube';

const baseUrl = getBaseUrl();

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
  return formatDate(today);
}
// 검색어로 인터뷰를 검색하는 함수
export async function searchInterviews(who: string): Promise<CustomSearchResult[]> {
  if (!who) return [];
  const mainWho = who.split(',')[0].trim();

  const afterDate = getDateYearsAgo(4);
  const query = `${mainWho} (${INTERVIEW_SITES.join(' OR ')}) after:${afterDate}`;
  console.log('searchInterviews query:', query);

  if (!query) return [];

  const res = await fetch(`${baseUrl}/api/google-api/interviews?query=${encodeURIComponent(query)}`);
  console.log('searchInterviews response status:', res);
  if (!res.ok) throw new Error('API 호출 실패 in searchInterviews');
  const data = await res.json();
  return Array.isArray(data)
    ? data.filter((item) => {
        const title = item.title?.toLowerCase() || '';
        return !title.includes('shorts') && !title.includes('reaction');
      })
    : [];
}
// 사용법:  const interviews = await getTrackIdInterview(who);

// Google GeminiAi 사용하여 인터뷰 검색
export async function searchInterviewsWithGeminiAI(who: string): Promise<CustomSearchResult[]> {
  const response = await fetch(`${baseUrl}/api/gemini-api/getInterviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: who }),
  });

  if (!response.ok) {
    console.error('Gemini API 호출 실패:', await response.text());
    throw new Error('Gemini API 호출 실패');
  }

  const chunkSize = 10;
  const results: CustomSearchResult[] = [];

  if (Array.isArray(response)) {
    for (let i = 0; i < response.length; i += chunkSize) {
      const chunk = response.slice(i, i + chunkSize);
      results.push(
        ...chunk.map((item) => ({
          title: item?.snippet?.title,
          link: `https://www.youtube.com/watch?v=${item?.id?.videoId}`,
          thumbnail: item?.snippet?.thumbnails?.high?.url,
          publishedAt: item?.snippet?.publishedAt,
          description: item?.snippet?.description,
          displayLink: 'www.youtube.com',
        }))
      );
      await ((globalThis as unknown as Global).scheduler?.yield?.() || new Promise((r) => setTimeout(r, 0)));
    }
  }
  return results;
}

// 유튜브 인터뷰 검색
export async function searchInterviewsWithYouTube(who: string): Promise<CustomSearchResult[]> {
  if (!who) return [];

  const res = await fetch(`${baseUrl}/api/google-api/youtube?q=${encodeURIComponent(who)}  ${who} interview`);
  if (!res.ok) throw new Error('API 호출 실패 in searchInterviewsWithYouTube');
  const data = await res.json();
  return Array.isArray(data)
    ? data.map((item: YouTubeItem) => ({
        title: item?.snippet?.title,
        link: `https://www.youtube.com/watch?v=${item?.id?.videoId}`,
        thumbnail: item?.snippet?.thumbnails?.high?.url,
        publishedAt: item?.snippet?.publishedAt,
        description: item?.snippet?.description,
        displayLink: 'www.youtube.com',
      }))
    : [];
}

// 아티스트별 인터뷰 검색 결과를 통합하여 반환하는 함수
export async function getCombinedInterviews(
  who: string,
  offset = 0,
  limit = 5
): Promise<{
  results: CustomSearchResult[];
  totalCount: number;
}> {
  const [googleResults, genAIResults] = await Promise.all([searchInterviews(who), searchInterviewsWithGeminiAI(who)]);

  const combinedMap = new Map<string, CustomSearchResult>();
  [...googleResults, ...genAIResults].forEach((item) => {
    if (!combinedMap.has(item.link)) {
      combinedMap.set(item.link, item);
    }
  });

  const combinedResults = Array.from(combinedMap.values());
  const totalCount = combinedResults.length;

  const paginatedResults = combinedResults.slice(offset, offset + limit);

  return {
    results: paginatedResults,
    totalCount,
  };
}
