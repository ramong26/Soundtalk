'use client';

import useUserStore from '@/stores/userStore';
import { useTodayMap } from '@/features/recommend/hooks/useTodayMap';

export default function TodayMusic() {
  const { user } = useUserStore();
  const data = useTodayMap(user?.id);

  if (!data) return <div>Loading...</div>;

  return (
    <section className="relative w-full h-screen bg-neutral-950">
      <div
        className="w-max absolute text-2xl font-bold text-black cursor-pointer"
        style={{ left: data.center.x, top: data.center.y }}
      >
        {data.center.name}
      </div>

      {data.items.map((item) => (
        <div
          key={item.id}
          className="w-max absolute text-sm text-black/70 hover:text-black transition-colors cursor-pointer"
          style={{ left: item.x, top: item.y }}
        >
          {item.name}
        </div>
      ))}
    </section>
  );
}
