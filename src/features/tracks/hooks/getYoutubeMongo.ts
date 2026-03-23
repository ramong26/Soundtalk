import connectToDB from '@/lib/mongo/mongo';
import { YoutubeChannel } from '@/lib/mongo/models/YoutubeChannel';
import { Youtube } from '@/lib/mongo/models/Youtube';
import { getBaseUrl } from '@/lib/utils/baseUrl';
import { YouTubeItem } from '@/shared/types/youtube';

export async function getYoutubeTrackIdVideo(trackName: string) {
  try {
    await connectToDB();

    const cached = await Youtube.findOne({ trackName });

    if (cached) {
      return cached.videos;
    }

    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/youtube-search?q=${encodeURIComponent(trackName)}`);

    if (!res.ok) {
      throw new Error('유튜브 검색에 실패했습니다');
    }

    const data = await res.json();
    const videos = data.items.map((item: YouTubeItem) => ({
      videoId: item?.id.videoId,
      title: item?.snippet.title,
      thumbnailUrl: item?.snippet.thumbnails.high.url,
    }));
    if (videos.length === 0) {
      throw new Error('비디오를 찾을 수 없습니다');
    }

    await Youtube.updateOne(
      { trackName },
      {
        $set: {
          trackName,
          videos,
          updatedAt: Date.now(),
        },
      },
      { upsert: true }
    );
    return videos;
  } catch (error) {
    console.error('getYoutubeTrackIdVideo() 에러:', error);
    return [];
  }
}

// 유튜브 채널 가져오는 함수(몽고)
export async function getYoutubeChannelInfo(channelHandle: string) {
  await connectToDB();

  const ONE_DAY = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const cachedChannel = await YoutubeChannel.findOne({ handle: channelHandle });

  if (cachedChannel && now - cachedChannel.updatedAt < ONE_DAY) {
    return cachedChannel.data;
  }

  const API_KEY = process.env.GOOGLE_API_KEY!;
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,statistics&forHandle=${channelHandle}&key=${API_KEY}`
  );

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('채널 정보를 찾을 수 없습니다');
  }

  const channelData = { ...data.items[0], updatedAt: Date.now() };
  await YoutubeChannel.updateOne(
    { handle: channelHandle },
    {
      $set: {
        handle: channelHandle,
        data: channelData,
        updatedAt: channelData.updatedAt,
      },
    },
    { upsert: true }
  );
  return channelData;
}
