import ChannelSection from '@/features/channel/components/ChannelSection';

export const metadata = {
  title: 'Music Channel Recommendation',
  description: 'Discover new music channels tailored for you',
};

export const revalidate = 86400;

export default function ChannelPage() {
  return (
    <div className="w-auto max-w-[1286px] lg:mx-auto mx-4 lg:mt-24 md:mt-16 mt-12 mb-16">
      <ChannelSection />
    </div>
  );
}
