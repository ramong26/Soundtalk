import Image from 'next/image';
import Link from 'next/link';

import { YouTubeChannel } from '@/shared/types/youtube';
import { getYoutubeChannelInfo } from '@/features/tracks/hooks/getYoutubeMongo';

export default async function ChannelList({ title }: { title: string }) {
  if (!title) {
    return null;
  }

  const channelHandleMap: Record<string, string[]> = {
    '믹스 채널 추천': ['RAPHAEL_MIXES', 'retapestudios', 'HumanoStudios'],
    'Jazz 채널 추천': ['ICYFOG', 'midnightradio2', 'RetroCafeRadio'],
    'Hiphop 채널 추천': ['peddlermusic'],
    'Rock 채널 추천': ['On8ight'],
  };
  const channelHandles = channelHandleMap[title] ?? [];

  const channelResults = await Promise.allSettled(
    channelHandles.map((handle) => getYoutubeChannelInfo(handle))
  );

  const channelInfos = channelResults
    .map((res, idx) =>
      res.status === 'fulfilled' ? { data: res.value, handle: channelHandles[idx] } : null
    )
    .filter(Boolean) as { data: YouTubeChannel; handle: string }[];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="list-none flex flex-col gap-6">
        {channelInfos.map(({ data, handle }) => (
          <li
            key={data.id}
            className="border-3 border-black p-6 text-center flex items-center justify-between h-fit gap-4"
          >
            <div className="flex flex-col items-center justify-center w-[150px]">
              <Image
                src={data.snippet?.thumbnails?.high?.url || '/default-profile.png'}
                alt={
                  data.snippet?.title ? `${data.snippet.title} Profile` : 'Default Channel Profile'
                }
                width={96}
                height={96}
                className="rounded-full"
              />
              <h3 className="text-lg font-semibold mt-4">{data.snippet?.title}</h3>
            </div>
            <p className="text-gray-600 text-xl font-semibold mt-2 line-clamp-3 w-[600px]">
              {data.snippet?.description}
            </p>
            <Link
              href={`https://www.youtube.com/@${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline inline-block mt-4 text-md"
            >
              채널 방문하기 →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
