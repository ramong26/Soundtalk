'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { YouTubeChannel } from '@/shared/types/youtube';
import { Ball } from '../YoutubeChannel/types';

export default function YoutubeChannelClient({ channels }: { channels: YouTubeChannel[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [activeCenter, setActiveCenter] = useState(false);
  const [balls, setBalls] = useState<Ball[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 초기 위치/속도 세팅
  useEffect(() => {
    const initialBalls = channels.map(() => ({
      x: Math.random() * 1200 - 500,
      y: Math.random() * 400 - 300,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));
    setBalls(initialBalls);
  }, [channels]);

  // 애니메이션 루프
  useEffect(() => {
    let animationFrame: number;

    const update = () => {
      setBalls((prev) =>
        prev.map((ball) => {
          let { x, y, vx, vy } = ball;

          if (activeCenter) {
            const dx = x;
            const dy = y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 2;
            vx += (dx / dist) * force;
            vy += (dy / dist) * force;
          }

          x += vx * 2;
          y += vy * 2;

          const maxX = 700;
          const maxY = 200;

          if (x > maxX || x < -maxX) vx *= -1;
          if (y > maxY || y < -maxY) vy *= -1;

          return {
            x: Math.max(-maxX, Math.min(x, maxX)),
            y: Math.max(-maxY, Math.min(y, maxY)),
            vx: vx * 0.98,
            vy: vy * 0.98,
          };
        })
      );
      animationFrame = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrame);
  }, [activeCenter]);
  if (!channels || channels.length === 0) {
    return null;
  }
  return (
    <section
      ref={containerRef}
      className="lg:h-[600px] md:h-[500px] h-[350px] relative w-full flex items-center justify-center bg-rose-500 overflow-hidden"
    >
      {/* 중앙 텍스트 */}
      <div
        className="absolute text-center z-20"
        onMouseEnter={() => setActiveCenter(true)}
        onMouseLeave={() => setActiveCenter(false)}
      >
        {active !== null ? (
          <>
            <h2
              className="lg:text-3xl md:text-2xl text-xl font-bold text-white"
              style={{
                textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000',
              }}
            >
              {channels?.[active]?.snippet?.title}
            </h2>
            <p
              className="md:text-xl text-lg mt-2 max-w-sm text-white"
              style={{
                textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
              }}
            >
              {channels?.[active]?.snippet?.description}
            </p>
            <p
              className="md:text-lg text-md mt-1 text-white"
              style={{
                textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
              }}
            >
              구독자 {channels?.[active]?.statistics?.subscriberCount}명 · 영상{' '}
              {channels?.[active]?.statistics?.videoCount}개
            </p>
          </>
        ) : (
          <h2
            className="lg:text-4xl md:text-2xl text-xl font-extrabold text-white hover:cursor-pointer hover:transition-transform hover:scale-105"
            style={{
              textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
            }}
          >
            Recommended Playlists
          </h2>
        )}
      </div>

      {/* 원형 아이콘들 */}
      {channels.map((channel, idx) => (
        <motion.div
          key={idx}
          className="lg:w-32 lg:h-32 md:w-24 md:h-24 w-16 h-16 absolute rounded-full bg-white flex items-center justify-center cursor-pointer shadow-lg"
          animate={{
            x: balls[idx]?.x || 0,
            y: balls[idx]?.y || 0,
          }}
          transition={{ type: 'tween', duration: 0.1 }}
          whileHover={{ scale: 1.2, zIndex: 30 }}
          onHoverStart={() => setActive(idx)}
          onHoverEnd={() => setActive(null)}
        >
          <Link href={`https://www.youtube.com/${channel.snippet?.customUrl}`}>
            <Image
              src={channel.snippet.thumbnails.default.url || channel.snippet.thumbnails.medium.url}
              alt={channel.snippet.title}
              width={96}
              height={96}
              className="lg:w-[96px] lg:h-[96px] md:w-[70px] md:h-[70px] w-[50px] h-[50px] rounded-full"
            />
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
