import { Suspense } from 'react';

import ChannelList from '@/features/channel/components/ChannelList';

export const metadata = {
  title: 'Music Channel Recommendation',
  description: 'Discover new music channels tailored for you',
};

export const revalidate = 86400;

export default function ChannelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChannelList />
    </Suspense>
  );
}
