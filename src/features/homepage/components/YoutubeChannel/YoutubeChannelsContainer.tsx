import YoutubeChannelClient from '@/features/homepage/components/YoutubeChannel/YoutubeChannelClient';
import { getYoutubeChannelInfo } from '@/features/tracks/hooks/getYoutubeMongo';

import { YouTubeChannel } from '@/shared/types/youtube';

export default async function YoutubeChannelsContainer() {
  const channelHandles = ['tsumi_chan', 'broadplay', 'boilerroom', 'HumanoStudios', 'mihonreko', 'What_Is_Mabisyo'];

  const channelInfos = await Promise.allSettled(channelHandles.map((handle) => getYoutubeChannelInfo(handle)));
  const fulfilledChannels = channelInfos
    .filter((result): result is PromiseFulfilledResult<YouTubeChannel> => result.status === 'fulfilled')
    .map((result) => result.value);

  return <YoutubeChannelClient channels={fulfilledChannels} />;
}
