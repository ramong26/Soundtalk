import { NextResponse } from 'next/server';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

export async function GET(request: Request) {
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    console.error('Google API Key or CSE ID is not configured');
    return NextResponse.json({ error: 'Google API Key or CSE ID is not configured' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      console.error('Query parameter is missing');
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CSE_ID}&q=${encodeURIComponent(
        query
      )}`,
      {
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Google API 호출 실패:', res.status, errorText);
      return NextResponse.json({ error: 'Failed to fetch interview search results' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data.items || []);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
